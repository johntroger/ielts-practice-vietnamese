# QUY TẮC BẢO VỆ HẠN MỨC SUPABASE (SUPABASE QUOTA & EGRESS PROTOCOL)

Tài liệu này quy định các tiêu chuẩn bắt buộc áp dụng cho toàn bộ codebase của **IELTS Web** khi đọc/ghi dữ liệu với **Supabase Cloud**, nhằm đảm bảo hệ thống vận hành bền vững 100% trong gói **Free Tier** mà không bao giờ bị vượt ngưỡng Egress (băng thông) hay dung lượng lưu trữ.

---

## 1. Giới hạn của Gói Miễn Phí (Supabase Free Tier Limits)

| Thông số | Hạn mức Free Tier | Mức tiêu thụ tối đa an toàn (Soft Cap) | Hành động khi vượt |
| :--- | :--- | :--- | :--- |
| **Băng thông tải về (Egress Bandwidth)** | **5.0 GB / tháng** (ân hạn 5.5 GB) | **< 3.5 GB / tháng** | Supabase cảnh báo / Giới hạn dịch vụ (Fair Use) |
| **Dung lượng Database** | **500 MB** | **< 200 MB** | Không cho ghi thêm dữ liệu |
| **Dung lượng File Storage** | **1.0 GB** | **< 500 MB** | Bị chặn upload file mới |
| **Người dùng hoạt động (Auth MAU)** | **50,000 users/tháng** | **< 40,000 users** | Giới hạn số lượng đăng nhập mới |

> [!CAUTION]
> **Bài học thực tế về Egress**: Lỗi thường gặp nhất không phải là đầy Database, mà là **Egress Bandwidth**. Chỉ cần 4 đề thi chứa ảnh Base64 nặng 1.5 MB mỗi đề, khi 1,000 người truy cập tải danh sách, hệ thống đã ngốn sạch `1,000 x 5 MB = 5 GB Egress`.

---

## 2. Các Nguyên Tắc Bắt Buộc (Strict Ingestion Rules)

### Nguyên tắc 1: CẤM TUYỆT ĐỐI lưu trữ Media Base64 dung lượng lớn trong Database
* **Nghiêm cấm** ghi các chuỗi Data URL Base64 (`data:image/...`, `data:audio/...`) có dung lượng `> 35 KB` vào các cột `task_data`, `user_submissions`, `user_vocab`.
* **Đối với Task 1 Process & Map**:
  * Bắt buộc sử dụng `ProcessMapRenderer` (Vector SVG Engine).
  * Đồ hoạ SVG được sinh tự động từ cấu trúc `processSteps` hoặc `mapChanges` với dung lượng chỉ vài KB, trực quan và sắc nét trên mọi màn hình. Tuyệt đối không nhúng ảnh PNG 1.5 MB do AI sinh vào `imageUrl`.
* **Đối với ảnh biểu đồ đề thi do người dùng tự tải lên**:
  * Bắt buộc qua bộ nén phân tầng (`TaskImageUploader`):
    * Giới hạn kích thước tối đa: **800px**.
    * Định dạng: JPEG / WebP chất lượng 0.58 - 0.75.
    * Dung lượng Base64 sau nén phải **< 35 KB**.

### Nguyên tắc 2: Giới hạn kích thước bản ghi (Row Payload Hard Cap)
Mọi bản ghi trước khi gọi `.upsert()` hoặc `.insert()` lên Supabase phải tuân thủ trần dung lượng:
* **Đề thi (`user_custom_tasks`)**: Tối đa **80 KB / bản ghi** (Database Check Constraint chặn cứng ở 120 KB).
* **Bài làm & Chấm điểm (`user_submissions`)**: Tối đa **80 KB / bản ghi** (Database Check Constraint chặn cứng ở 120 KB).
* **Từ vựng & Sổ tay (`user_vocab`)**: Tối đa **4 KB / bản ghi**.

### Nguyên tắc 3: Quy trình xử lý phân tầng khi dữ liệu quá lớn (Tiered Fallback Strategy)
Nếu một đối tượng dữ liệu vượt quá kích thước an toàn, lập trình viên và các module code phải xử lý theo 3 bước:
1. **Lược bỏ dữ liệu phụ (Strip non-essentials)**:
   * Xóa bỏ các trường debug, log quá trình, raw API response (ví dụ: `rawAiResponse`, `candidates`, `svgIllustration` thừa).
   * Rút gọn feedback chi tiết nếu vượt quá 30 nhận xét.
2. **Nén tối đa (Aggressive Compression)**:
   * Chuyển các mảng dữ liệu lặp lại thành cấu trúc rút gọn.
   * Nén ảnh qua Canvas đa tầng cho đến khi dưới 35 KB.
3. **Lưu trữ cục bộ (Local-first Fallback)**:
   * Nếu dữ liệu hình ảnh hoặc bài làm vẫn quá nặng và không thể nén thêm: **chỉ lưu tại máy người dùng (`IndexedDB` hoặc `localStorage`)**.
   * Chỉ đồng bộ lên Supabase Cloud phần khung sườn siêu nhẹ (Metadata: Tiêu đề, Topic, Điểm số, Ngày tạo) kèm cờ đánh dấu `isLocalMedia: true`.

### Nguyên tắc 4: Cơ chế chống ngốn Egress phía Client (Egress Throttling & Caching)
* **Bắt buộc Cache có thời hạn (TTL)**:
  * Mọi hàm fetch dữ liệu cộng đồng (`fetchPublicTasks`, `fetchPublicDrills`, `fetchPublicVocabGrammarItems`) phải có bộ đệm bộ nhớ + LocalStorage với TTL tối thiểu **30 phút**.
  * Trong vòng 30 phút, việc chuyển tab, mở modal hay quay lại trang tuyệt đối **không gửi request mới về Supabase**.
* **Chỉ SELECT các trường cần thiết & có LIMIT**:
  * Khi lấy danh sách đề thi, chỉ SELECT các trường tóm tắt (`id, is_public, creator_email, created_at, task_data`).
  * Luôn đặt `limit(150)` hoặc `limit(80)`, không bao giờ query vô hạn định `select('*')`.
* **Cung cấp nút "Làm mới" thủ công**:
  * Người dùng chỉ tải lại từ Cloud khi chủ động bấm nút Refresh / Đồng bộ.

---

## 3. Các Công Cụ & Rào Chắn Đã Được Tích Hợp

1. **Bộ lọc tự động trước khi ghi Cloud**: `src/utils/supabaseStorageGuard.js`
   * `sanitizeTaskForCloud(task)`: Tự động phát hiện và gỡ ảnh Base64 nặng, kiểm tra payload < 80 KB.
   * `sanitizeSubmissionForCloud(sub)`: Tự động gỡ payload rác trong bài nộp.
   * `sanitizeDrillForCloud(drill)`: Gỡ bỏ audio Base64, chuyển sang dùng Web Speech API.
2. **Bộ nhớ đệm thông minh**: `src/services/dataSyncService.js`
   * Tự động cache danh sách đề thi và micro-drills 30 phút.
   * Tự động làm sạch dữ liệu cũ còn sót lại trên client.
3. **Rào chắn cấp Cơ sở dữ liệu (PostgreSQL Constraint)**: `supabase_schema.sql`
   * `chk_user_custom_tasks_payload_size`: Từ chối mọi bản ghi `task_data > 120 KB`.
   * `chk_user_submissions_payload_size`: Từ chối mọi bài nộp `essay > 50 KB` hoặc `evaluation > 150 KB`.

---

## 4. Checklist Kiểm Tra Khi Thêm Tính Năng Mới
Trước khi commit bất kỳ tính năng nào liên quan đến Supabase:
- [ ] Tính năng này có đẩy file/ảnh/âm thanh lên Supabase không? Nếu có, đã dùng URL hoặc nén < 35 KB chưa?
- [ ] Dữ liệu gửi lên đã đi qua hàm `sanitize*ForCloud()` trong `src/utils/supabaseStorageGuard.js` chưa?
- [ ] Hàm fetch danh sách có phân trang (`limit`) và có cơ chế Cache phía Client chưa?
- [ ] Đã kiểm tra kích thước payload bằng `getByteLength()` để đảm bảo < 80 KB chưa?
