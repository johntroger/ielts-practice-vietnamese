# 📊 Theo Dõi Tiến Độ, Hồ Sơ Cá Nhân & Bảng Điểm TRF

> **Chuyên mục**: `analytics_profile` | **Số lượng**: **8 tính năng**  
> **Tổng quan**: Phân tích dữ liệu học tập cá nhân hóa, biểu đồ radar 4 kỹ năng, lịch sử bài làm và cơ chế xuất phiếu điểm Test Report Form (TRF) chuẩn quốc tế.

[← Quay lại Trung Tâm Tính Năng](README.md)

---

<a id="feat-mastered-4skills"></a>

## 1. Hệ Thống Đánh Dấu "Đã Thuộc" (Mastered) Cả 4 Kỹ Năng

> **Phiên bản**: `v2.7` | **Huy hiệu**: `Nâng Cấp` | **Kỹ năng**: **Writing** • **Reading** • **Speaking** • **Listening** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Đánh dấu các đề bài, chủ đề, cue card đã thuần thục để lọc bớt và tập trung thời gian cho những dạng bài còn yếu.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Phủ sóng 4 kỹ năng: Đánh dấu đề Writing, bài đọc Reading, bài nghe Listening và các chủ đề Part 1/2/3 Speaking.
- Bộ lọc "Ẩn Đề Đã Thuộc": Giúp danh sách đề luôn tinh gọn, chỉ hiển thị bài chưa làm hoặc cần ôn tập lại.
- Tổng hợp tại Trang Cá Nhân (User Profile): Tab "Kho Đã Thuộc" hiển thị chi tiết số lượng và danh mục đề đã master theo từng kỹ năng.
- Hỗ trợ chế độ Khách (Guest Mode): Lưu an toàn trên thiết bị và tự động đồng bộ lên Đám Mây khi đăng nhập tài khoản.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Nhấn nút "Đã Thuộc" hình chiếc mũ cử nhân (🎓) trên thanh công cụ của đề bài hoặc trong Thư viện đề.
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Xem Đề Đã Thuộc"** trong giao diện làm bài.

---

<a id="feat-diagnostic-test"></a>

## 2. Bài Test Chẩn Đoán Trình Độ & Đề Xuất Lộ Trình (Diagnostic Placement)

> **Phiên bản**: `v2.0` | **Huy hiệu**: `Đánh Giá Đầu Vào` | **Kỹ năng**: **Writing** • **Reading** • **Listening** • **Speaking** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Bài kiểm tra ngắn xác định chính xác trình độ hiện tại của bạn và đề xuất kế hoạch học tập tối ưu hóa thời gian.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Chẩn đoán năng lực 4 kỹ năng chỉ trong 15-20 phút.
- Dự báo dải điểm hiện tại (Current Band) và khoảng cách tới mục tiêu (Target Band).

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Bấm vào avatar cá nhân -> Chọn "Làm Bài Test Phân Lớp Đầu Vào".
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Làm Bài Test Phân Lớp"** trong giao diện làm bài.

---

<a id="feat-weekly-progress-report"></a>

## 3. Báo Cáo Tiến Độ Học Tập Hàng Tuần (Weekly Analytics Report)

> **Phiên bản**: `v2.0` | **Huy hiệu**: `Phân Tích` | **Kỹ năng**: **Writing** • **Reading** • **Listening** • **Speaking** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Tổng kết thời lượng học, số lượng đề đã luyện, biểu đồ biến thiên điểm số và chuỗi ngày học liên tục (Streak).

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Biểu đồ tiến độ trực quan: So sánh năng suất giữa các tuần học.
- Theo dõi chuỗi Streak: Giữ vững động lực học tập mỗi ngày.
- Khuyến nghị trọng tâm cho tuần mới dựa trên kỹ năng còn thấp điểm nhất.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Bấm nút "Tiến Độ" trên thanh điều hướng để xem báo cáo học tập tuần này.
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Xem Báo Cáo Tuần"** trong giao diện làm bài.

---

<a id="feat-supabase-cloud-account"></a>

## 4. Tài Khoản Đa Nền Tảng & Đồng Bộ Đám Mây (Supabase Auth)

> **Phiên bản**: `v2.0` | **Huy hiệu**: `Đám Mây` | **Kỹ năng**: **Writing** • **Reading** • **Listening** • **Speaking** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Đăng nhập 1-click bằng Google hoặc Email. Tự động đồng bộ lịch sử bài thi, đề tự tạo và từ vựng trên mọi thiết bị.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Google 1-Click Login: Tiện lợi, bảo mật cấp doanh nghiệp.
- Bảo mật cấp dòng (Row Level Security): Dữ liệu bài làm của bạn được bảo vệ tuyệt đối.
- Đồng bộ tức thì: Viết bài trên máy tính và mở lại trên điện thoại dễ dàng.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Bấm nút "Tài Khoản" trên thanh điều hướng để đăng nhập.
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Đăng Nhập / Đăng Ký"** trong giao diện làm bài.

---

<a id="feat-user-profile-center"></a>

## 5. Trung Tâm Hồ Sơ Cá Nhân & Danh Hiệu Học Thuật (User Profile)

> **Phiên bản**: `v2.7` | **Huy hiệu**: `Hồ Sơ` | **Kỹ năng**: **Writing** • **Reading** • **Listening** • **Speaking** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Quản lý thông tin học tập, bảng xếp hạng thứ hạng Cambridge, kho đề đã master và lịch sử điểm số tổng thể.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Thứ hạng học thuật động: Từ "IELTS Foundation Builder" đến "Cambridge Grandmaster".
- Kho Đã Thuộc 4 kỹ năng: Xem tổng hợp số đề đã thành thạo.
- Lịch sử bài thi chi tiết kèm bảng tiêu chí chấm điểm.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Bấm vào ảnh đại diện hoặc tên tài khoản ở góc trên bên phải thanh Navbar.
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Mở Trang Cá Nhân"** trong giao diện làm bài.

---

<a id="feat-history-evaluation-vault"></a>

## 6. Kho Lưu Trữ & Tra Cứu Lịch Sử Bài Làm Đa Kỹ Năng

> **Phiên bản**: `v2.8` | **Huy hiệu**: `Lịch Sử` | **Kỹ năng**: **Writing** • **Speaking** • **Reading** • **Listening** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Xem lại toàn bộ bài viết, đoạn ghi âm nói, bảng điểm 4 tiêu chí và bộ lọc theo phương thức chấm (⚡ Máy / 🤖 AI).

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Lưu trữ toàn diện bài làm của cả 4 kỹ năng kèm thời gian chi tiết.
- Huy hiệu phân loại phương thức chấm Speaking (⚡ Chấm Máy / 🤖 Chấm AI) giúp dễ dàng đối chiếu.
- Xuất bản và in ấn lại bài chấm bất kỳ lúc nào.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Bấm vào nút "Lịch Sử" trên thanh điều hướng hoặc trong Menu Cá Nhân.
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Xem Lịch Sử Bài Làm"** trong giao diện làm bài.

---

<a id="feat-trf-simulator"></a>

## 7. Phiếu Điểm IELTS TRF Simulator Chuẩn Khảo Thí (Test Report Form PDF)

> **Phiên bản**: `v4.0` | **Huy hiệu**: `Chứng Chỉ TRF` | **Kỹ năng**: **Writing** • **Reading** • **Listening** • **Speaking** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Mô phỏng phiếu điểm chính thức của British Council / IDP / Cambridge với thuật toán làm tròn Overall Band chuẩn xác, mã xác thực QR và xuất PDF.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Bảng điểm 4 kỹ năng Listening, Reading, Writing, Speaking và Overall Band chuẩn khảo thí.
- Thuật toán làm tròn Cambridge: .25 lên .5, .75 lên 1.0 và quy đổi cấp độ CEFR (B2, C1, C2).
- Mã bảo mật xác thực (Validation Code), dấu mộc khảo thí và watermark chìm bảo vệ chứng chỉ.
- In hoặc xuất file PDF độ phân giải cao A4 chuẩn mực trong 1 click.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Vào Tab "🏆 Bảng Điểm TRF 4 Kỹ Năng" trong Phòng Thi Thử (Mock Test Vault) -> Bấm "Xem & Tải Phiếu Điểm (PDF)".
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Mở Bảng Điểm TRF"** trong giao diện làm bài.

---

<a id="feat-growth-analytics"></a>

## 8. Bảng Phân Tích Tăng Trưởng & Dự Báo Ngày Đạt Band Mục Tiêu (Growth Analytics)

> **Phiên bản**: `v4.0` | **Huy hiệu**: `Dự Báo ETA` | **Kỹ năng**: **Writing** • **Reading** • **Listening** • **Speaking** | **Phím tắt**: _Không có_

### 📝 Mô Tả Tính Năng
Dự báo ngày cán đích Target Band dựa trên định mức khảo thí Cambridge (~120h luyện tập chủ động / 0.5 band) và phân tích điểm nghẽn 4 kỹ năng.

### 💎 Điểm Nổi Bật & Giá Trị Học Thuật
- Dự báo ngày hoàn thành mục tiêu (Target Band ETA) theo cường độ học hàng tuần linh hoạt.
- Phát hiện điểm nghẽn ưu tiên số 1 (Bottleneck Skill Gap) đang kéo tụt Overall Band.
- Định mức giờ luyện tập cần thiết theo chuẩn thống kê Cambridge Assessment.
- Đưa ra lời khuyên sư phạm chiến lược cho từng kỹ năng để bứt phá band điểm nhanh nhất.

### 🎯 Hướng Dẫn Thao Tác Từng Bước
```text
Mở Hồ Sơ Cá Nhân hoặc Help Center -> Bấm "Dự Báo Ngày Cán Đích".
```

> 💡 **Thao tác nhanh trên Web**: Tính năng này được tích hợp sẵn 1-click action **"Xem Dự Báo Tăng Trưởng"** trong giao diện làm bài.

---

*Tài liệu tự động đồng bộ từ `src/core/featureRegistry.js` qua GitHub & GitBook.*
