# Quy tắc Tự động Dọn dẹp Dung lượng Dự án (Storage Hygiene Rule)

Sau khi hoàn thành việc viết code, chạy script một lần (one-off scripts) hoặc kiểm thử (testing):
1. **Chủ động xóa ngay các file tạm / nháp không cần thiết**:
   - Không để lại thư mục `scratch/`, file log tạm, file trích xuất text tạm (`.txt`, `.tmp`), ảnh chụp màn hình kiểm thử lẻ, hoặc các script chạy 1 lần không còn giá trị tái sử dụng.
   - Xóa thư mục `dist/` nếu có chạy `vite build` để kiểm thử local sau khi kiểm tra xong.
2. **Quản lý thư viện (`node_modules`)**:
   - Nếu cài đặt thư viện tạm thời để xử lý dữ liệu một lần (ví dụ `pdf-parse`, `puppeteer`, v.v.), phải chạy `npm uninstall <package>` ngay sau khi hoàn tất công việc để tránh làm phình `node_modules`.
3. **Giữ sạch thư mục gốc và `public/`**:
   - Không lưu các file tài liệu ngoài luồng hoặc ảnh nặng không được import/sử dụng trực tiếp bởi ứng dụng trong `public/`.

# Quy tắc Bắt buộc: Giao diện Tiếng Anh Tuyệt đối Toàn Website (Strict Global English UI)

- Khi người dùng ở chế độ tiếng Anh (`isEn === true` hoặc English UI mode):
  1. **Tuyệt đối 100% không xuất hiện bất kỳ từ tiếng Việt nào** trên toàn bộ website, áp dụng cho tất cả các phân hệ:
     - **4 Kỹ năng IELTS**: Writing, Speaking, Listening, Reading (bao gồm Workspaces, QuestionPanes, PassagePanes, PromptPanes, Test Libraries, Result Modals, Transcript Modals, Audio Players, Pacing Bars, Word Overuse Highlighters, Image Zoom Modals...).
     - **Các phòng luyện & Tính năng thông minh**: Atlas English Arena, Adaptive 30-Min Sprint Coach, Targeted Reflex Studio (Micro-Drills), Diagnostic Placement Test, 30-Day Personalized Roadmap, Error Log & Paraphrase Journal, C1/C2 Vocab Notebook, Grammar & Vocab Handbook, Theory Handbook.
     - **Toàn bộ khung điều hướng & Hệ thống UI Shell**: Navbar, SubHeaders, Toolbars, Dropdown Menus, Context Menus, Floating Tooltips, Modals/Dialogs, Toast Notifications, Confirm Dialogs, Form Placeholders, Status Badges, System Settings, Leaderboards, User Profiles, Fanfare Celebrations, QR Modals, Feedback Forms.
  2. **Chuẩn hóa dữ liệu ngân hàng đề & bài tập mới**:
     - Mọi dữ liệu đề thi, bài tập, câu hỏi, hướng dẫn, bài đọc, kịch bản hội thoại, câu hỏi trắc nghiệm, bẫy distractor, bảng paraphrase, nhãn diagram, lời giải thích và tiêu chí chấm thi khi nạp vào hệ thống bắt buộc phải có phiên bản tiếng Anh chuẩn khảo thí Cambridge (`titleEn`, `explanationEn`, `instructionEn`, `topicEn`, `categoryEn`, `trapTypeEn`, `evidenceEn`...) hoặc hiển thị hoàn toàn bằng tiếng Anh khi ở chế độ `isEn`.


