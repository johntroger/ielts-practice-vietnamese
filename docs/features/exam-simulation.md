# ⏱️ Phòng Thi Thử Chuẩn CDI & Chế Độ Marathon 3 Kỹ Năng

> **Chuyên mục**: `exam_simulation` | **Số lượng**: **6 tính năng**  
> **Tổng quan**: Không gian mô phỏng phòng thi máy tính thực tế (Computer-Delivered IELTS) của IDP/British Council với giao diện chuẩn mực và phím tắt thi thật.

[← Quay lại Trung Tâm Tính Năng](README.md)

---

<a id="feat-speaking-pacing-bar"></a>

## 1. Thanh Căn Nhịp Độ 2 Phút Speaking Part 2 (Speaking Pacing Bar)

> **Phiên bản**: `v3.2` | **Huy hiệu**: `Mới Ra Mắt` | **Kỹ năng**: **Speaking** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Bản đồ 4 chặng thời gian vàng (0-30s bối cảnh, 30-75s diễn biến, 75-105s cao trào, 105-120s đúc kết) giúp giữ nhịp nói 1:50 - 2:00 không lo hụt ý hay cháy giờ.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Bản Đồ 4 Chặng Thời Gian Vàng Cambridge: Phân chia 120 giây thành 4 giai đoạn rõ ràng: Khởi động bối cảnh, Chi tiết cốt lõi, Cao trào cảm xúc và Đúc kết bài học.
- Gợi Ý Chiến Thuật Thời Gian Thực (Live Coaching Prompts): Tự động hiển thị lời khuyên sư phạm tương ứng với từng giây đang nói để thí sinh luôn làm chủ mạch bài.
- Vạch Báo Động Vùng Điểm Fluency: Cảnh báo vùng nguy cơ non giờ (< 1:15 bị kẹt Band 5.0), vùng an toàn (1:15 - 1:45) và vùng chạm đích xuất sắc (1:45 - 2:00 Band 7.5 - 8.5+).
- Đếm Ngược 15 Giây Về Đích: Nhịp thở nhấp nháy êm ái nhắc nhở thí sinh kết bài tròn vẹn trước khi Giám khảo ngắt lời.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Tại phòng Luyện Nói Speaking hoặc Phòng Thi Giám Khảo, khi chuyển sang Part 2, thanh Pacing Bar sẽ tự động đồng bộ theo thời gian ghi âm của bạn.
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Vào Phòng Luyện Speaking"** trong giao diện làm bài.

---

<a id="feat-speaking-mock-examiner"></a>

## 2. Phòng Thi Nói Giám Khảo Mô Phỏng Cambridge (Examiner Room)

> **Phiên bản**: `v2.8` | **Huy hiệu**: `Mới Ra Mắt` | **Kỹ năng**: **Speaking** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Trải nghiệm thi vấn đáp 1:1 trọn vẹn 3 Parts (11-14 phút) với Giám khảo ảo mô phỏng đúng quy trình thi thực tế của British Council / IDP.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Part 1: Phỏng vấn 4-5 câu hỏi giới thiệu và sở thích cá nhân, tính giờ phản xạ tự nhiên.
- Part 2: Phát thẻ đề (Cue Card), đồng hồ 1 phút chuẩn bị tự động kèm giấy nháp ảo (Notepad) và 2 phút ghi âm liên tục.
- Part 3: Thảo luận chuyên sâu 4-5 câu hỏi trừu tượng mang tính học thuật cao.
- Nút "Kết Thúc Sớm & Xem Điểm" linh hoạt khi cần nộp bài sớm để chấm điểm tức thì.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Vào phân hệ "Speaking" -> Bấm tab "🎓 Phòng Thi Giám Khảo" -> Chọn bộ đề thi mẫu và bấm "Bắt Đầu Thi Thử".
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Vào Phòng Thi Giám Khảo"** trong giao diện làm bài.

---

<a id="feat-writing-cdi-workspace"></a>

## 3. Phòng Viết Chuẩn Cambridge CDI & Chế Độ Tập Trung (Focus Mode)

> **Phiên bản**: `v2.4` | **Huy hiệu**: `Cốt Lõi` | **Kỹ năng**: **Writing** | **Phím tắt**: `Alt + F`

### 📝 Mô Tả Tính Năng
Không gian soạn thảo mô phỏng 100% giao diện thi máy tính thực tế của IDP/BC với bộ đếm từ tự động và phím tắt thi thật.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Giao diện chia đôi màn hình chuẩn CDI: Cột đề bài bên trái, trình soạn thảo chuẩn hóa bên phải.
- Chế độ Focus Mode (Alt + F): Ẩn toàn bộ thanh điều hướng để tập trung 100% tinh thần cho bài viết.
- Chống gian lận & mất chữ tự động (Auto-Save): Tự động lưu bản nháp mỗi 5 giây vào LocalStorage.
- Bộ đếm từ thời gian thực: Tự động cảnh báo khi dưới 150 từ (Task 1) hoặc dưới 250 từ (Task 2).

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Chuyển sang tab "Writing" trên thanh Navbar. Nhấn Alt + F để bật/tắt chế độ toàn màn hình tập trung.
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Vào Phòng Luyện Writing"** trong giao diện làm bài.

---

<a id="feat-reading-cdi-workspace"></a>

## 4. Phòng Thi Đọc CDI Trực Quan: Tra Từ & Phá Bẫy Distractor

> **Phiên bản**: `v2.4` | **Huy hiệu**: `Cốt Lõi` | **Kỹ năng**: **Reading** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Luyện đọc 3 Passages với tính năng Highlight từ vựng, tra nghĩa tức thì, hỗ trợ cả 2 hệ Academic (AC) và General Training (GT).

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Chia đôi bài đọc và câu hỏi độc lập: Cuộn mượt mà không bị trôi bài đọc.
- Hỗ trợ đầy đủ dạng câu hỏi: True/False/Not Given, Yes/No/Not Given, Matching Headings, Multiple Choice, Summary Completion.
- Chấm điểm tự động và giải thích chi tiết: Giải phẫu vị trí bẫy gây nhiễu (Distractor Traps) trong bài đọc.
- Bảng quy đổi Band điểm Cambridge chuẩn xác cho cả Academic và General Training.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Chọn kỹ năng "Reading" trên Navbar -> Chọn đề bài từ Thư viện và bấm "Bắt Đầu Làm Bài".
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Vào Phòng Luyện Reading"** trong giao diện làm bài.

---

<a id="feat-listening-cdi-workspace"></a>

## 5. Phòng Luyện Nghe Đa Tốc Độ & Audioscript Phân Đoạn Thông Minh

> **Phiên bản**: `v2.4` | **Huy hiệu**: `Cốt Lõi` | **Kỹ năng**: **Listening** | **Phím tắt**: `Space (Play/Pause)`

### 📝 Mô Tả Tính Năng
Mô phỏng 4 Sections đề nghe IELTS với trình phát audio chống giật, tua chậm 0.8x-1.5x và audioscript định vị đáp án.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Công nghệ Audio Chunking: Tải nhanh âm thanh mượt mà không bị cắt tiếng trên mọi đường truyền mạng.
- Kiểm soát tốc độ (0.8x - 1.5x): Hỗ trợ luyện nghe từ cơ bản đến nâng cao phản xạ tốc độ cao.
- Chấm điểm từ ngữ nghiêm ngặt: Kiểm tra chặt chẽ giới hạn số từ (Word Limit) và chính tả số nhiều/số ít.
- Audioscript đối soát: Sau khi nộp bài, xem lại vị trí phát âm đáp án trong bài nghe.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Chọn kỹ năng "Listening" trên Navbar -> Chọn bài nghe và nhấn phím Space để bật/tắt audio.
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Vào Phòng Luyện Listening"** trong giao diện làm bài.

---

<a id="feat-mock-test-vault"></a>

## 6. Phòng Thi Thử Áp Lực Cao (Mock Test Vault) 60 Phút & Đại Thi Thử

> **Phiên bản**: `v2.0` | **Huy hiệu**: `Thực Chiến` | **Kỹ năng**: **Writing** • **Reading** • **Listening** • **Speaking** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Mô phỏng áp lực phòng thi thật với đồng hồ đếm ngược liên tục, khóa gợi ý và cấp bảng điểm tổng thể chuẩn Cambridge.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Thi Thử Writing 60 Phút: Làm bài liên hoàn Task 1 & Task 2 trong điều kiện thời gian ngặt nghèo.
- Thi Thử Reading 60 Phút: Đọc trọn vẹn 3 Passages (40 câu), hỗ trợ bốc đề ngẫu nhiên hoặc chọn bộ đề Cambridge.
- Đại Thi Thử 4 Kỹ Năng (All-In-One Grand Mock ~2h45p): Dự đoán Bảng Điểm Tổng TRF ước tính.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Vào Menu Luyện Tập -> Bấm "Thi Thử 60 Phút" để chọn phân hệ thi mong muốn.
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Mở Phòng Thi Thử"** trong giao diện làm bài.

---

*Tài liệu tự động đồng bộ từ `src/core/featureRegistry.js` qua GitHub & GitBook.*
