# IELTS Web - Codebase Partitioning & AI Model Tiering Map
*Tài liệu định vị module và tối ưu hóa chi phí token cho lập trình AI (Gemini / Claude / GPT)*

Mục tiêu của tài liệu này: **Giúp AI Agent chỉ cần đọc đúng 1-2 file liên quan và chọn đúng model Gemini phù hợp nhất, giảm 80-90% lượng token tiêu thụ mỗi phiên làm việc.**

---

## 1. Ma Trận Lựa Chọn Model Gemini (Model Tiering Matrix)

| Tầng Codebase | Loại tác vụ | Model đề xuất | Context cần đọc | Chi phí & Tốc độ |
|---|---|---|---|---|
| **Tầng 1: Data & Config** | Thêm đề thi mới, sửa lỗi chính tả từ vựng, sửa config, sửa mock tests | **Gemini 2.5 Flash Lite** / `flash_lite` | Chỉ 1 file trong `src/data/` | Siêu rẻ, tốc độ tức thì (~1-2k tokens) |
| **Tầng 2: UI Presentation** | Chỉnh sửa giao diện, Tailwind CSS, Modal, thêm icon Lucide, responsive mobile | **Gemini 2.5 Flash** / `flash` | 1 file component + UI props | Rất rẻ, tối ưu cú pháp React & CSS (~3-8k tokens) |
| **Tầng 3: Hooks & State** | Thêm phím tắt, timer, quản lý modal store, audio recorder | **Gemini 2.5 Flash** / `flash` | 1 file hook trong `src/hooks/` | Rẻ, nhanh (~5-10k tokens) |
| **Tầng 4: Domain & Algo** | Thuật toán chấm điểm IELTS, công thức làm tròn TRF, xử lý âm thanh phức tạp, sync Supabase | **Gemini 2.5 Pro** / `pro` | File service mục tiêu + file test trong `tests/` | Cần suy luận logic sâu, chặt chẽ |

---

## 2. Bản Đồ Phân Vùng Codebase (Module Directory Partitioning)

### 📂 TẦNG 1: DỮ LIỆU & NỘI DUNG TĨNH (`src/data/`)
> **Model khuyến nghị:** `flash_lite` hoặc `flash`  
> **Nguyên tắc Context:** KHÔNG đọc bất kỳ file React JSX nào. Chỉ đọc đúng file data cần chỉnh sửa.

* `sampleTasks.js`: Đề thi Writing Task 1 & Task 2 mẫu + 3 đề cộng đồng mặc định.
* `readingTasks.js`: Bài đọc Cambridge Reading (Passage 1, 2, 3), câu hỏi Matching/TFNG.
* `listeningTasks.js`: Bài nghe Cambridge Listening (Section 1 -> 4), transcript, audio URL.
* `speakingTopics.js`: Đề Speaking Part 1, Part 2 cue cards, Part 3 follow-ups.
* `communityMicroDrills.js`: Kho câu hỏi luyện phản xạ nhanh (Collocation, Grammar traps).

---

### 📂 TẦNG 2: GIAO DIỆN & WORKSPACE (`src/components/`)
> **Model khuyến nghị:** `flash`  
> **Nguyên tắc Context:** Chỉ đọc component cần sửa. Không bao giờ nạp toàn bộ `src/services/` vào context.

* **Workspaces chính (Màn hình luyện 4 kỹ năng):**
  * `WritingWorkspace`: Soạn thảo Essay, xem Outline, Live Band Matrix, Task Overview.
  * `SpeakingWorkspace`: Thu âm, AI Examiner phỏng vấn, visualizer sóng âm.
  * `ReadingWorkspace`: Đọc bài thi chia đôi màn hình, highlight dẫn chứng, điền đáp án.
  * `ListeningWorkspace`: Nghe audio, CDI shortcuts (Tab, Enter), nạp đáp án.
* **Modals chức năng độc lập (Utility Modals):**
  * `TaskLibraryModal.jsx`: Thư viện đề, tìm kiếm, lọc Task 1/2, tab Đã thuộc.
  * `MockTestModal.jsx`: Chế độ thi thử Full CDI 60 phút, Cambridge Marathon 3 kỹ năng.
  * `FeedbackModal.jsx`: Bảng điểm chi tiết 4 tiêu chí (TR, CC, LR, GRA) và sửa lỗi câu.
  * `VocabGrammarSpellingModal.jsx`: Sổ tay bẫy ngữ pháp, chính tả, flashcards.
  * `GrowthAnalyticsModal.jsx`: Biểu đồ tiến độ, dự đoán Band điểm mục tiêu.

---

### 📂 TẦNG 3: STATE & CUSTOM HOOKS (`src/hooks/` & `src/core/`)
> **Model khuyến nghị:** `flash` (hoặc `pro` nếu có AudioContext / Race Condition)  
> **Nguyên tắc Context:** Chỉ đọc hook cần sửa + `appStore.js` nếu cần chia sẻ state.

* `appStore.js`: Kho state toàn cục nhẹ kiểu Pub/Sub (thay thế Redux cồng kềnh).
* `modalStore.js`: Quản lý đóng/mở tất cả modal tập trung.
* `featureRegistry.js`: Danh mục tính năng tự động đăng ký vào Help Center.
* `useAudioEngine.js` & `useSpeechEngine.js`: Quản lý Web Speech API, chia nhỏ audio chunk chống ngắt tiếng.
* `useSpeakingExaminer.js`: Máy trạng thái (State machine) tương tác giám khảo AI phỏng vấn.
* `useKeyboardShortcuts.js`: Phím tắt toàn cục chuẩn kỳ thi máy tính CDI (Ctrl+S, Alt+T, v.v.).

---

### 📂 TẦNG 4: THUẬT TOÁN & DỊCH VỤ CỐT LÕI (`src/services/`)
> **Model khuyến nghị:** `pro` (Cần độ chính xác tuyệt đối, tránh hallucination)  
> **Nguyên tắc Context:** Chỉ mở hàm nghiệp vụ cụ thể. Sau khi sửa, chạy test offline tương ứng trong `tests/`.

* `algorithmicEvaluationService.js`: Bộ máy chấm điểm Writing thuật toán (200+ quy tắc Cambridge, Band capping).
* `algorithmicSpeakingService.js`: Chấm điểm phát âm, độ trôi chảy (WPM), từ đệm (filler words).
* `trfExportService.js`: Bộ mô phỏng phiếu điểm chính thức TRF & quy tắc làm tròn Grand Rounding.
* `growthPredictorService.js`: Mô hình dự đoán số giờ học cần thiết để lên Band (Cambridge Benchmark).
* `dataSyncService.js`: Đồng bộ hóa dữ liệu thời gian thực Supabase Cloud & BroadcastChannel.
* `processMapSvgEngine.js`: Trình vẽ vector tự động cho đề quy trình & bản đồ Task 1.

---

## 3. Mẹo Prompting Tiết Kiệm 90% Token Cho Người Dùng

Khi yêu cầu AI thực hiện tác vụ, hãy áp dụng mẫu prompt có ranh giới rõ ràng:

### ❌ Prompt lãng phí token (AI sẽ quét toàn bộ repo):
> *"Sửa giúp tôi lỗi giao diện nút bấm trong thư viện đề và cập nhật bài đọc mới."*

### ✅ Prompt tối ưu (Tiết kiệm tối đa token):
> *"Chỉ mở file `src/components/TaskLibraryModal.jsx`. Sửa lại padding của nút 'Tất cả' cho gọn hơn trên mobile. Dùng model Gemini Flash, không đọc các file services hay core."*

### 🧪 Quy trình kiểm thử sau khi sửa:
Không cần AI đọc lại code, chỉ cần chạy script test offline:
```bash
node tests/run_all_tests.js
```
Nếu 41/41 bộ test pass sạch sẽ, bạn biết chắc chắn thay đổi không làm hỏng bất kỳ chức năng nào!
