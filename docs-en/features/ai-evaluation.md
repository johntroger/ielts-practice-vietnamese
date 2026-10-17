# 🤖 Phân Hệ AI & Hệ Thống Chấm Điểm Kép Chuẩn Cambridge

> **Chuyên mục**: `ai_evaluation` | **Số lượng**: **6 tính năng**  
> **Tổng quan**: Tổng hợp các công cụ trí tuệ nhân tạo và bộ chấm thuật toán máy tính 0.02ms, phân tích 4 tiêu chí Cambridge (TR/TA, CC, LR, GRA, FC, PR).

[← Quay lại Trung Tâm Tính Năng](README.md)

---

<a id="feat-distractor-trap-decoder"></a>

## 1. Bộ Giải Mã & Bóc Tách Bẫy Khảo Thí Cambridge (Distractor Trap Decoder)

> **Phiên bản**: `v3.2` | **Huy hiệu**: `Mới Ra Mắt` | **Kỹ năng**: **Reading** • **Listening** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Tự động nhận diện 6 mẫu hình bẫy kinh điển (False Synonym, Scope Creep NOT GIVEN, Turnaround Pivot...) kèm phân tích tâm lý và chiến thuật phản xạ 3 giây.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Giải Mã 6 Archetype Bẫy Khảo Thí: Bẫy Trùng Từ Giả (False Synonym), Bẫy Suy Diễn NOT GIVEN, Bẫy Bẻ Lái 180 Độ Phút Chót (Listening Turnaround), Bẫy Số Liệu & Đơn Vị Nhiễu, Bẫy Từ Tuyệt Đối Hóa và Phủ Định Ẩn.
- Bóc Trần Tâm Lý Thí Sinh: Giải thích cặn kẽ vì sao mắt hoặc tai bạn bị thu hút vào đáp án sai thay vì chỉ thông báo đúng/sai đơn thuần.
- Chiến Thuật Phản Xạ 3 Giây (3-Second Reflex Rule): Cung cấp bí kíp thực chiến của Giám khảo Cambridge để không bao giờ mắc lại lỗi sai tương tự.
- Tự Động 100% Offline & Lưu Sổ Lỗi Sai: Hoạt động tức thời không cần API Key và hỗ trợ lưu 1-chạm vào Sổ Lỗi Sai Cá Nhân để ôn tập định kỳ.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Sau khi làm bài Reading hoặc Listening và nộp bài, tại các câu làm sai, hệ thống tự động hiển thị thẻ "Bẫy Khảo Thí Cambridge" với phân tích chi tiết và chiến thuật phản xạ.
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Vào Phòng Luyện Reading"** trong giao diện làm bài.

---

<a id="feat-speaking-filler-tracker"></a>

## 2. Bộ Đếm Từ Đệm & Sóng Âm Trực Quan (Speaking Fluency Studio)

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

## 3. Bản Đồ Nhiệt Cấu Trúc Câu (GRA Sentence Structure Heatmap)

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

## 4. Hệ Thống Chấm Điểm Speaking Kép (⚡ Chấm Máy & 🤖 Chấm AI)

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

## 5. Giám Khảo AI Chấm Điểm Writing 4 Tiêu Chí Kèm Radar Chart

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

<a id="feat-peel-argument-checker"></a>

## 6. Công Cụ Kiểm Định Chuỗi Lập Luận PEEL (PEEL Argument Coherence Checker)

> **Phiên bản**: `v4.6` | **Huy hiệu**: `Chuẩn TR & CC 7.0+` | **Kỹ năng**: **Writing** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Kiểm định cấu trúc đoạn thân bài Task 2 theo chuẩn Cambridge: Point ➔ Explanation ➔ Evidence ➔ Link, phát hiện nhận định thiếu căn cứ và đề xuất bản mẫu Band 8.5+.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Giải phẫu chức năng 4 thành phần kinh điển: P (Luận điểm), E (Cơ chế giải thích), E (Dẫn chứng thực tế), L (Móc nối hệ quả).
- Đo lường Điểm Hoàn Thiện PEEL (0 - 100%) và ước lượng Band điểm Task Response / Coherence & Cohesion tức thì.
- Cảnh báo thông minh các nhận định thiếu căn cứ (Unsupported Claims) và ví dụ mang tính cá nhân hoá.
- Đề xuất đoạn văn mẫu viết lại hoàn chỉnh Band 8.5+ nâng tầm từ ý tưởng gốc của học viên kèm nút sao chép 1-chạm.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Tại màn hình Luyện viết Task 2, nhấn nút "Check Đoạn PEEL (AI)" ở cột Đề bài hoặc mở modal "Lập Luận Task 2" trong trình soạn thảo.
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Mở Phòng Viết Task 2"** trong giao diện làm bài.

---

*Tài liệu tự động đồng bộ từ `src/core/featureRegistry.js` qua GitHub & GitBook.*
