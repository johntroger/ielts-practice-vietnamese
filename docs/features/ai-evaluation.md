# 🤖 Phân Hệ AI & Hệ Thống Chấm Điểm Kép Chuẩn Cambridge

> **Chuyên mục**: `ai_evaluation` | **Số lượng**: **4 tính năng**  
> **Tổng quan**: Tổng hợp các công cụ trí tuệ nhân tạo và bộ chấm thuật toán máy tính 0.02ms, phân tích 4 tiêu chí Cambridge (TR/TA, CC, LR, GRA, FC, PR).

[← Quay lại Trung Tâm Tính Năng](README.md)

---

<a id="feat-speaking-filler-tracker"></a>

## 1. Bộ Đếm Từ Đệm & Sóng Âm Trực Quan (Speaking Fluency Studio)

> **Phiên bản**: `v3.0` | **Huy hiệu**: `Mới Ra Mắt` | **Kỹ năng**: **Speaking** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Tự động phát hiện và cảnh báo các từ đệm ngập ngừng (uh, um, like, you know) theo tần suất thời gian thực, kết hợp sóng âm đa tầng 60 FPS.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Bộ lọc nhận diện filler words thời gian thực: Tự động đếm tần suất ngập ngừng ("uh", "um", "like", "you know", "actually", "basically").
- Cảnh báo tiêu chuẩn Cambridge Fluency & Coherence: Báo động ngay nếu tần suất vượt quá 5 từ/phút (nguy cơ tụt xuống Band 5.5).
- Cẩm nang thay thế tự nhiên (Buying-Time Alternatives): Gợi ý các cụm từ đệm tự nhiên như "Well, to be perfectly candid...", "That is an intriguing question...".
- Sóng âm trực quan (Organic Waveform 60 FPS): Hiển thị biên độ âm thanh thời gian thực giúp học viên luôn kiểm soát âm lượng và trường độ nói.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Tại phòng Luyện Nói Speaking hoặc Phòng Thi Giám Khảo, sau khi nói, hệ thống sẽ tự động hiển thị thanh thống kê từ đệm ngay bên dưới transcript.
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Vào Phòng Luyện Speaking"** trong giao diện làm bài.

---

<a id="feat-sentence-structure-heatmap"></a>

## 2. Bản Đồ Nhiệt Cấu Trúc Câu (GRA Sentence Structure Heatmap)

> **Phiên bản**: `v3.0` | **Huy hiệu**: `Mới Ra Mắt` | **Kỹ năng**: **Writing** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Phân tích cú pháp thời gian thực tỷ lệ Câu Đơn, Câu Ghép & Câu Phức theo tiêu chí Grammatical Range & Accuracy (GRA) chuẩn Cambridge.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Phân loại 3 cấp độ cú pháp: 🟢 Câu Phức (Subordinating / Relative / Inversion), 🔵 Câu Ghép (FANBOYS), 🟡 Câu Đơn (Simple).
- Thanh đo nhiệt 3 màu trực quan kèm dự phóng Band GRA: Cảnh báo ngay nếu tỷ lệ câu đơn > 40% (nguy cơ kẹt ở Band 5.5-6.0).
- Bộ soi chi tiết từng câu trong bài viết kèm lý giải cấu trúc và gợi ý nâng cấp câu đơn sang câu phức.
- Cẩm nang 4 mẫu câu vàng (Mệnh đề nhượng bộ, quan hệ chỉ hệ quả, đảo ngữ, phân từ rút gọn) để bứt phá Band 7.5 - 8.0+ GRA.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Tại màn hình Writing, nhấn nút "Cấu Trúc GRA" trên thanh công cụ soạn bài để mở Bản Đồ Nhiệt và xem phân tích thời gian thực.
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Mở Phân Tích Cấu Trúc Câu"** trong giao diện làm bài.

---

<a id="feat-speaking-dual-engine"></a>

## 3. Hệ Thống Chấm Điểm Speaking Kép (⚡ Chấm Máy & 🤖 Chấm AI)

> **Phiên bản**: `v2.8` | **Huy hiệu**: `Mới Ra Mắt` | **Kỹ năng**: **Speaking** | **Phím tắt**: `Alt + S`

### 📝 Mô Tả Tính Năng
Tùy chọn linh hoạt giữa chấm bằng máy tính siêu tốc 0.02ms (Cambridge Algorithmic Scorer) và chấm bằng Trí Tuệ Nhân Tạo (AI Examiner).

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- ⚡ Chấm Máy Thuật Toán Cambridge: Phân tích 4 tiêu chí (Fluency, Lexical Resource, Grammatical Accuracy, Pronunciation) dựa trên WPM, độ đa dạng từ vựng TTR, cấu trúc mệnh đề và âm tiết khó trong 0.02ms.
- 🤖 Chấm AI Chuyên Sâu: Giám khảo AI nhận xét ngữ pháp theo ngữ cảnh, sửa phát âm từng từ và gợi ý diễn đạt band 8.0+.
- Cơ chế tự động chuyển đổi phòng hộ (Resilience Fallback): Tự động dùng Chấm Máy khi không có mạng, hết quota hoặc chưa nhập API Key.
- Tùy chỉnh động cơ mặc định trong Cài Đặt (⚙️) và hiển thị huy hiệu phương thức (⚡ Máy / 🤖 AI) trong Lịch Sử Thi.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Tại phòng Luyện Speaking hoặc Phòng Thi Giám Khảo, sau khi ghi âm bấm nút "⚡ Chấm Máy (Thuật toán)" để nhận điểm tức thì hoặc "🤖 Chấm AI" để xem phân tích chi tiết.
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Vào Phòng Luyện Speaking"** trong giao diện làm bài.

---

<a id="feat-ai-task2-grading"></a>

## 4. Giám Khảo AI Chấm Điểm Writing 4 Tiêu Chí Kèm Radar Chart

> **Phiên bản**: `v2.3` | **Huy hiệu**: `Cambridge 4 Tiêu Chí` | **Kỹ năng**: **Writing** | **Phím tắt**: `Ctrl + Enter`

### 📝 Mô Tả Tính Năng
Chấm điểm chi tiết Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Accuracy kèm bài viết mẫu nâng cấp Band 8.5+.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Biểu đồ mạng nhện (Radar Chart): Trực quan hóa điểm số từng tiêu chí giúp nhận ra ngay điểm nghẽn.
- Sửa lỗi từng câu (Inline Corrections): Đối chiếu câu gốc và câu sửa chuẩn học thuật kèm giải thích lỗi sai.
- Bài mẫu Band 8.5+ nâng cấp từ ý của bạn: Giúp học collocations đắt giá từ chính bài làm của mình.
- Xuất báo cáo kết quả: In hoặc tải file Word (.docx) kết quả chấm điểm chuyên nghiệp.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Sau khi viết xong bài trong phòng Writing, nhấn nút "Nộp Bài & Chấm Điểm AI" hoặc nhấn Ctrl + Enter.
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Thử Chấm Điểm Writing"** trong giao diện làm bài.

---

*Tài liệu tự động đồng bộ từ `src/core/featureRegistry.js` qua GitHub & GitBook.*
