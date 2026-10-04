# 🚀 Trung Tâm Hướng Dẫn & Tính Năng Nền Tảng (Feature Matrix)

> **Cập nhật tự động**: Trang tài liệu này được đồng bộ trực tiếp từ Codebase (`src/core/featureRegistry.js`).  
> **Tổng số tính năng hiện có**: **38 tính năng chuyên sâu** | **Phiên bản mới nhất**: `v3.0 (2026 Edition)`

---

## 📌 Tổng Quan Hệ Sinh Thái IELTS Practice

Hệ thống **IELTS Practice Vietnamese** được thiết kế theo tiêu chuẩn phòng thi máy tính **Computer-Delivered IELTS (CDI)** của Cambridge, IDP và British Council. Toàn bộ nền tảng vận hành trên kiến trúc **Local-First**, bảo vệ quyền riêng tư người học và hỗ trợ chấm điểm linh hoạt (kết hợp chấm máy siêu tốc 0.02ms và Giám khảo Trí tuệ Nhân tạo).

### 📊 Thống Kê Phân Hệ & Tính Năng

| Chuyên Mục Tính Năng | Số Lượng | Trạng Thái Nổi Bật | Xem Tài Liệu |
| :--- | :---: | :--- | :--- |
| 🤖 **Phân Hệ AI** | **4** tính năng | Đầy đủ hướng dẫn & mẹo thi | [Xem chi tiết ↗](ai-evaluation.md) |
| 🛠️ **Kho Đề Thi** | **10** tính năng | Đầy đủ hướng dẫn & mẹo thi | [Xem chi tiết ↗](practice-tools.md) |
| ⏱️ **Phòng Thi Thử Chuẩn CDI** | **5** tính năng | Đầy đủ hướng dẫn & mẹo thi | [Xem chi tiết ↗](exam-simulation.md) |
| 📖 **Cẩm Nang Lý Thuyết** | **5** tính năng | Đầy đủ hướng dẫn & mẹo thi | [Xem chi tiết ↗](theory-vocab.md) |
| 📊 **Theo Dõi Tiến Độ, Hồ Sơ Cá Nhân** | **8** tính năng | Đầy đủ hướng dẫn & mẹo thi | [Xem chi tiết ↗](analytics-profile.md) |
| ⌨️ **Giao Diện Tập Trung** | **6** tính năng | Đầy đủ hướng dẫn & mẹo thi | [Xem chi tiết ↗](shortcuts-ux.md) |

---

## ⚡ Bảng Tra Cứu Phím Tắt Thi Máy Chuẩn Quốc Tế

Hệ thống tích hợp toàn bộ các phím tắt tiêu chuẩn quốc tế giúp bạn thao tác với tốc độ tối đa trong phòng thi máy:

| Phím Tắt | Chức Năng | Tính Năng Liên Kết |
| :--- | :--- | :--- |
| `Alt + S` | Hệ Thống Chấm Điểm Speaking Kép (⚡ Chấm Máy & 🤖 Chấm AI) | [Chi tiết ↗](ai-evaluation.md#feat-speaking-dual-engine) |
| `Ctrl + V` | Tải Lên & Dán Trực Tiếp Ảnh Biểu Đồ Writing Task 1 (Ctrl + V) | [Chi tiết ↗](practice-tools.md#feat-task1-image-upload) |
| `Alt + F` | Phòng Viết Chuẩn Cambridge CDI & Chế Độ Tập Trung (Focus Mode) | [Chi tiết ↗](exam-simulation.md#feat-writing-cdi-workspace) |
| `Space (Play/Pause)` | Phòng Luyện Nghe Đa Tốc Độ & Audioscript Phân Đoạn Thông Minh | [Chi tiết ↗](exam-simulation.md#feat-listening-cdi-workspace) |
| `Ctrl + Enter` | Giám Khảo AI Chấm Điểm Writing 4 Tiêu Chí Kèm Radar Chart | [Chi tiết ↗](ai-evaluation.md#feat-ai-task2-grading) |
| `F1 / Alt + H` | Hệ Thống Phím Tắt Toàn Cục Tối Ưu Tốc Độ Thao Tác | [Chi tiết ↗](shortcuts-ux.md#feat-keyboard-shortcuts-hub) |
| `F1 / Alt + H` | Trung Tâm Trợ Giúp & Tra Cứu Tính Năng Toàn Năng (Help Center) | [Chi tiết ↗](shortcuts-ux.md#feat-help-center-hub) |

---

## 🌟 Các Tính Năng Mới Cập Nhật (Release 2026)

Dưới đây là các tính năng học thuật mới nhất được nâng cấp trên hệ thống:

### ✦ [Chế Độ Luyện Tập Tinh Giản (Minimal Focus View)](shortcuts-ux.md#feat-minimal-focus-view)
- **Phiên bản**: `v3.1` | **Kỹ năng**: **Writing**
- **Tóm tắt**: Chuyển đổi 1-chạm giữa giao diện tập trung tinh giản (Zero Distraction) và Pro Studio, ẩn bớt tải nhận thức và gom gọn các chỉ số phân tích.
- **Cách dùng nhanh**: Tại thanh công cụ IELTS Writing, nhấn vào nút "✨ Tinh Giản" trên thanh điều hướng subheader hoặc mở menu Tiện ích để chuyển chế độ.

### ✦ [Bộ Đếm Từ Đệm & Sóng Âm Trực Quan (Speaking Fluency Studio)](ai-evaluation.md#feat-speaking-filler-tracker)
- **Phiên bản**: `v3.0` | **Kỹ năng**: **Speaking**
- **Tóm tắt**: Tự động phát hiện và cảnh báo các từ đệm ngập ngừng (uh, um, like, you know) theo tần suất thời gian thực, kết hợp sóng âm đa tầng 60 FPS.
- **Cách dùng nhanh**: Tại phòng Luyện Nói Speaking hoặc Phòng Thi Giám Khảo, sau khi nói, hệ thống sẽ tự động hiển thị thanh thống kê từ đệm ngay bên dưới transcript.

### ✦ [Bản Đồ Nhiệt Cấu Trúc Câu (GRA Sentence Structure Heatmap)](ai-evaluation.md#feat-sentence-structure-heatmap)
- **Phiên bản**: `v3.0` | **Kỹ năng**: **Writing**
- **Tóm tắt**: Phân tích cú pháp thời gian thực tỷ lệ Câu Đơn, Câu Ghép & Câu Phức theo tiêu chí Grammatical Range & Accuracy (GRA) chuẩn Cambridge.
- **Cách dùng nhanh**: Tại màn hình Writing, nhấn nút "Cấu Trúc GRA" trên thanh công cụ soạn bài để mở Bản Đồ Nhiệt và xem phân tích thời gian thực.

### ✦ [Hệ Thống Chấm Điểm Speaking Kép (⚡ Chấm Máy & 🤖 Chấm AI)](ai-evaluation.md#feat-speaking-dual-engine)
- **Phiên bản**: `v2.8` | **Kỹ năng**: **Speaking**
- **Tóm tắt**: Tùy chọn linh hoạt giữa chấm bằng máy tính siêu tốc 0.02ms (Cambridge Algorithmic Scorer) và chấm bằng Trí Tuệ Nhân Tạo (AI Examiner).
- **Cách dùng nhanh**: Tại phòng Luyện Speaking hoặc Phòng Thi Giám Khảo, sau khi ghi âm bấm nút "⚡ Chấm Máy (Thuật toán)" để nhận điểm tức thì hoặc "🤖 Chấm AI" để xem phân tích chi tiết.

### ✦ [Phòng Thi Nói Giám Khảo Mô Phỏng Cambridge (Examiner Room)](exam-simulation.md#feat-speaking-mock-examiner)
- **Phiên bản**: `v2.8` | **Kỹ năng**: **Speaking**
- **Tóm tắt**: Trải nghiệm thi vấn đáp 1:1 trọn vẹn 3 Parts (11-14 phút) với Giám khảo ảo mô phỏng đúng quy trình thi thực tế của British Council / IDP.
- **Cách dùng nhanh**: Vào phân hệ "Speaking" -> Bấm tab "🎓 Phòng Thi Giám Khảo" -> Chọn bộ đề thi mẫu và bấm "Bắt Đầu Thi Thử".

### ✦ [Tùy Chỉnh Hiển Thị & Tương Phản Chuẩn Thi CDI (CDI Display)](shortcuts-ux.md#feat-cdi-display-settings)
- **Phiên bản**: `v3.0` | **Kỹ năng**: **Writing** • **Reading** • **Listening** • **Speaking**
- **Tóm tắt**: Cấu hình cỡ chữ (Standard, Large, Extra Large) và bảng màu tương phản (Đen/Trắng, Trắng/Đen, Xanh/Vàng nhạt) chuẩn phòng thi máy tính IDP/BC.
- **Cách dùng nhanh**: Nhấp vào nút "Màn Hình CDI" trên thanh công cụ hoặc menu để mở giao diện cài đặt.

### ✦ [Đơn Thuốc Sửa Lỗi Sai Mỗi Ngày (Spaced Repetition Micro-Drill)](practice-tools.md#feat-daily-error-prescription)
- **Phiên bản**: `v3.0` | **Kỹ năng**: **Writing** • **Speaking**
- **Tóm tắt**: Vòng lặp học tập cá nhân hóa 3 phút/ngày: Chuyển hóa lỗi sai thực tế từ bài viết và các bẫy ngữ pháp thường gặp thành câu đố trắc nghiệm phản xạ.
- **Cách dùng nhanh**: Vào Toolbar Writing -> Bấm "Tiện Ích Khác" -> Chọn "Đơn Thuốc Sửa Lỗi", hoặc vào Hồ Sơ Cá Nhân để mở.

### ✦ [Phiếu Điểm IELTS TRF Simulator Chuẩn Khảo Thí (Test Report Form PDF)](analytics-profile.md#feat-trf-simulator)
- **Phiên bản**: `v4.0` | **Kỹ năng**: **Writing** • **Reading** • **Listening** • **Speaking**
- **Tóm tắt**: Mô phỏng phiếu điểm chính thức của British Council / IDP / Cambridge với thuật toán làm tròn Overall Band chuẩn xác, mã xác thực QR và xuất PDF.
- **Cách dùng nhanh**: Vào Tab "🏆 Bảng Điểm TRF 4 Kỹ Năng" trong Phòng Thi Thử (Mock Test Vault) -> Bấm "Xem & Tải Phiếu Điểm (PDF)".

### ✦ [Bảng Phân Tích Tăng Trưởng & Dự Báo Ngày Đạt Band Mục Tiêu (Growth Analytics)](analytics-profile.md#feat-growth-analytics)
- **Phiên bản**: `v4.0` | **Kỹ năng**: **Writing** • **Reading** • **Listening** • **Speaking**
- **Tóm tắt**: Dự báo ngày cán đích Target Band dựa trên định mức khảo thí Cambridge (~120h luyện tập chủ động / 0.5 band) và phân tích điểm nghẽn 4 kỹ năng.
- **Cách dùng nhanh**: Mở Hồ Sơ Cá Nhân hoặc Help Center -> Bấm "Dự Báo Ngày Cán Đích".

### ✦ [Thẻ Gợi Ý Bài Tập Thông Minh Hàng Ngày (Smart Daily Recommendation)](practice-tools.md#feat-smart-recommendation-engine)
- **Phiên bản**: `v4.5` | **Kỹ năng**: **Writing** • **Reading** • **Listening** • **Speaking**
- **Tóm tắt**: Tự động phân tích lịch sử bài làm, sổ lỗi sai và mục tiêu điểm để đề xuất bài luyện trọng tâm trong ngày, chống trì hoãn học tập và cân bằng kỹ năng.
- **Cách dùng nhanh**: Thẻ gợi ý xuất hiện ở đầu Workspace luyện viết. Bấm "Luyện ngay" để kích hoạt đề thi hoặc công cụ được gợi ý.

---
*Tài liệu tự động đồng bộ qua GitBook Sync Pipeline. Mọi thay đổi trong source code sẽ tự động cập nhật lên đây.*
