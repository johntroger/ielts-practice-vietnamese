# Hướng Dẫn Cấu Hình Đồng Bộ Một Chiều (One-Way Sync) Giữa GitHub và GitBook

> **Mục tiêu**: Đảm bảo toàn vẹn dữ liệu, triệt tiêu 100% rủi ro xung đột mã nguồn (Merge Conflict) và vòng lặp ghi đè khi chỉnh sửa tài liệu.  
> **Nguyên tắc**: **GitHub là Single Source of Truth (SSOT)**. Mọi bài viết, mục lục và sửa đổi chỉ được commit từ GitHub hoặc Local IDE, GitBook chỉ đóng vai trò hiển thị (Read-Only Publishing Frontend).

---

## 1. Tại Sao Cần Thiết Lập One-Way Sync?

Mặc định khi kết nối GitHub với GitBook qua chế độ Hai chiều (Two-way sync):
- Nếu ai đó bấm nút **"Edit"** trên giao diện GitBook Web và lưu lại, GitBook sẽ tự động tạo một commit mới bắn ngược về nhánh `main` trên GitHub.
- Trong khi đó, codebase có pre-commit hook tự động chạy `scripts/sync_features_to_gitbook.js` để cập nhật `docs/features/` và `docs/SUMMARY.md`.
- Hai tiến trình này ghi đè lên nhau sẽ tạo ra **Git Merge Conflict** làm nghẽn toàn bộ pipeline cập nhật.

**Giải pháp chuẩn kiến trúc phần mềm:** Khóa quyền sửa trực tiếp trên GitBook, biến GitBook thành giao diện trình chiếu tĩnh chất lượng cao lấy nguồn duy nhất từ nhánh `main` của GitHub.

---

## 2. Các Bước Cấu Hình Trên GitBook Dashboard (3 Bước Nhanh)

### Bước 1: Truy Cập Cài Đặt Không Gian (Space Settings)
1. Đăng nhập vào tài khoản GitBook: [https://app.gitbook.com/](https://app.gitbook.com/)
2. Chọn Space tài liệu của bạn (ví dụ: `vneconomics-docs` hoặc `ielts-practice-vietnamese`).
3. Nhấp vào biểu tượng bánh răng **Settings** ở góc dưới thanh điều hướng bên trái $\rightarrow$ Chọn mục **Integrations** (hoặc **GitHub**).

### Bước 2: Cấu Hình GitHub Integration
1. Trong phần thiết lập GitHub, kiểm tra nhánh đồng bộ đã chọn là `main`.
2. Kiểm tra thư mục gốc tài liệu (Root directory): Đảm bảo cấu hình là `docs` (hoặc để trống nếu file `.gitbook.yaml` ở gốc repo đã chỉ định `root: docs`).
3. **Quan trọng nhất (Khóa quyền sửa từ web GitBook)**:
   - Tìm mục **Sync Direction** hoặc **Permissions**: Chọn chế độ **"Read-only from GitHub"** hoặc **"GitHub to GitBook only"**.
   - Nếu dùng phiên bản GitBook mới nhất: Tại mục **Branch permissions**, gạt tắt tùy chọn *"Allow editing in GitBook and committing back to GitHub"*.

### Bước 3: Kiểm Tra Webhook Trực Tiếp Trên GitHub
1. Vào repository: `https://github.com/johntroger/ielts-practice-vietnamese/settings/hooks`
2. Kiểm tra webhook của GitBook (có URL dạng `https://api.gitbook.com/v1/integrations/github/...`):
   - Đảm bảo có tích xanh ✅ (Status 200 OK).
   - Sự kiện kích hoạt (Events): Chỉ cần lắng nghe sự kiện **Pushes** vào nhánh `main`.

---

## 3. Quy Trình Xuất Bản Tài Liệu Chuẩn Của Dự Án

Từ nay trở đi, quy trình thêm bài viết mới hoặc chỉnh sửa tài liệu diễn ra cực kỳ mượt mà:

```
[1. Viết bài trong docs/ trên IDE]
             │
             ▼
[2. Kiểm thử liên kết: npm test (Step 89)]
             │
             ▼
[3. Commit & Push lên origin main]
             │
             ├──► [GitHub Actions]: Chạy linter & tự động kiểm tra liên kết
             │
             └──► [GitBook Webhook]: Tự động pull và render giao diện trong 60 giây
```

---

*Tài liệu này thuộc bộ quy chuẩn kiến trúc của IELTS Practice Platform.*
