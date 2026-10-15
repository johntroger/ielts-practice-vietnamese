# QUY TRÌNH XỬ LÝ & PHÂN BỔ AUDIO TỰ ĐỘNG (AUDIO PROCESSING PROTOCOL)

Tài liệu này quy định quy trình tiêu chuẩn khi tiếp nhận bất kỳ file audio nào từ người dùng vào dự án **IELTS Web**.

---

## 1. Nguyên Tắc Cốt Lõi: "Tận Dụng Tối Đa 100% Tài Nguyên"
Mỗi file audio đưa vào hệ thống phải được lưu trữ trên **Cloudflare R2** (băng thông miễn phí $0) và **phân bổ đồng thời vào tất cả các phân hệ liên quan đến Listening** trên website, không để lãng phí dữ liệu.

---

## 2. Quy Trình 4 Bước Tự Động Hóa

### Bước 1: Upload lên Cloudflare R2
- Sử dụng script tự động: `node scripts/r2_audio_manager.js upload <filePath> <key>`
- Lấy đường link công khai: `https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/<key>`
- Đảm bảo audio hỗ trợ `Accept-Ranges: bytes` để tua mượt mà trên web.

### Bước 2: Phân Tích Nội Dung & Bẫy Khảo Thí (Cambridge Traps)
- Phân tích transcript, người nói, ngữ cảnh, từ vựng học thuật, thời lượng và mốc thời gian (timestamps).
- Xác định các bẫy thông tin kinh điển:
  - Bẫy tự sửa (Self-correction)
  - Bẫy điều kiện/tiềm năng vs hiện trạng (Potential vs Actual)
  - Bẫy số lượng, bẫy vị trí, bẫy từ gây nhiễu (Distractors).

### Bước 3: Phân Bổ Câu Hỏi Vào 3 Phân Hệ Web

| Phân hệ | Vị trí file mã nguồn | Các dạng câu hỏi cần tạo |
| :--- | :--- | :--- |
| **1. Luyện Thi IELTS Listening Chính** | `src/data/listening/<testName>.js`<br>đăng ký vào `src/data/listeningTasks.js` | Tạo bài thi hoàn chỉnh bao gồm các dạng chuẩn Cambridge:<br>• Note / Form / Table Completion<br>• Pick Multiple (Chọn 2 trong 5)<br>• Classification Matching<br>• Sentence Completion<br>• Short Answer Questions / Map Labelling |
| **2. Đấu Trường Atlas English Arena** | `src/data/arenaQuestionBank.js` | Tạo 2–5 câu hỏi phản xạ tốc độ cao:<br>• Dạng `listening_trap` (Bẫy nghe)<br>• Dạng `vocab` & `paraphrase` từ đoạn nghe<br>• Phân bổ theo độ khó: Easy, Medium, Hard |
| **3. Phòng Luyện Nghe Vi Mô (Micro-Drills)** | `src/data/listeningMicroDrills.js` | Tạo các bài luyện chuyên sâu:<br>• **Room 1: Dictation (Chép chính tả):** Trích câu đắt giá nhất cắt mốc audio `clipStart` và `clipEnd`.<br>• **Room 2: Spelling/Number Reflex:** Luyện từ vựng/chính tả dễ sai.<br>• **Room 3: Distractor Trap Buster:** Bài tập giải thích cơ chế bẫy nghe. |

### Bước 4: Kiểm Tra & Biên Dịch (Build Verification)
- Chạy lệnh `npm run build` để đảm bảo hệ thống không bị lỗi cú pháp, dữ liệu đồng bộ và sẵn sàng phục vụ học viên.
