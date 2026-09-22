# Tài liệu Kiến trúc Kỹ thuật — SignalFlow cho Neurodivergence

**ADC Hackathon 2026 | Module Declutter + Communicate**
**Lĩnh vực được giao chính thức:** Neurodivergence (ví dụ: ADHD), theo thư xác nhận BTC ngày 14/09/2026.
**Ngày soạn:** 16/09/2026
**Trạng thái:** Kiến trúc chuẩn bị trước — chưa khóa cứng vào một bài toán cụ thể, vì brief chi tiết chỉ công bố sáng 21/09/2026.

> **Nguyên tắc thiết kế:** Xây một **bộ hạ tầng lắp ráp nhanh** (toolkit), không xây một app hoàn chỉnh cho một giả định. Khi biết brief thật vào Ngày 1, đội chỉ cần chọn đúng module đã sẵn sàng và nối dây, không code từ số 0.

---

## 0. Phạm vi và ràng buộc

| Ràng buộc | Chi tiết |
|---|---|
| Thời gian build thật | 21–23/09/2026, làm việc trực tiếp, demo/video dưới 5 phút |
| Thời gian chuẩn bị trước | 16–20/09/2026 (~5 ngày, có họp online bắt buộc 18/09 10–11h) |
| Phần cứng demo | Laptop thông thường, trình duyệt, có thể không có GPU |
| Persona chính | Người trưởng thành neurodivergent (ADHD là ví dụ BTC nêu, không giới hạn) trong bối cảnh nơi làm việc |
| Không làm | Suy luận cảm xúc/mức chú ý từ camera; chẩn đoán; auto-gửi tin nhắn/email không xác nhận; chấm điểm năng suất |
| Ngôn ngữ | Tiếng Việt là ngôn ngữ chính của giao diện và giọng nói |

Kiến trúc này **kế thừa trực tiếp** lớp bằng chứng (evidence layer) và renderer đã thiết kế trong nghiên cứu SignalFlow trước đó ([DHH_Neurodivergence_Deep_Research_VI.md](DHH_Neurodivergence_Deep_Research_VI.md), mục 6), chỉ đổi trọng tâm persona và thêm hai module đầu ra mới.

---

## 1. Tổng quan hệ thống

```text
┌────────────────────────────── LỚP THU NHẬN (Capture) ──────────────────────────────┐
│  Micro (getUserMedia)        │  Camera/Screen-share (chụp slide, tài liệu, form)   │
└──────────────┬───────────────┴──────────────────────┬────────────────────────────────┘
               │ PCM audio chunks                      │ ảnh tĩnh (JPEG/PNG)
               ▼                                        ▼
┌────────────────────────────── LỚP XỬ LÝ (Processing) ──────────────────────────────┐
│  STT Service        OCR Service        LLM Restructure/Tone-check Service          │
│  (VAD→ASR→timestamp)  (ảnh→text thô)    (text thô → JSON có schema, có evidenceId) │
└──────────────┬────────────────┬──────────────────────────┬────────────────────────┘
               │                │                           │
               ▼                ▼                           ▼
┌────────────────────────────── LỚP BẰNG CHỨNG (Evidence Store) ─────────────────────┐
│  utterances[]   declutterCards[]   communicateDrafts[]   corrections[]            │
│  (SQLite/IndexedDB — append-only, có timestamp, có nguồn)                         │
└──────────────┬────────────────┬──────────────────────────┬────────────────────────┘
               │                │                           │
               ▼                ▼                           ▼
┌────────────────────────────── LỚP HIỂN THỊ (Renderer) ─────────────────────────────┐
│  Focus/Combined caption view  │  Declutter panel   │  Communicate composer          │
│  (đã có từ SignalFlow gốc)    │  (card đơn giản)   │  (chọn cụm từ → xem trước → TTS)│
└──────────────────────────────────────────────────────────────────────────────────────┘
               │
               ▼
┌────────────────────────────── LỚP ĐẦU RA (Output) ─────────────────────────────────┐
│  TTS playback (giọng nói)     │  Card hiển thị trực quan  │  Export/xác nhận thủ công │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Nguyên tắc bất biến xuyên suốt** (kế thừa từ nghiên cứu gốc): mọi trường dữ liệu suy luận (simplifiedBlocks, suggestedPhrasing, now/before/next) phải có `evidenceIds` trỏ về dữ liệu nguồn (audio timestamp hoặc ảnh gốc). Không có bằng chứng → hiển thị "Không đủ bằng chứng", không bịa.

---

## 2. Lớp bằng chứng dùng chung (Evidence Store)

Đây là phần **tái sử dụng nguyên vẹn** từ kiến trúc SignalFlow cũ, mở rộng thêm 2 collection mới.

### 2.1 `utterances` (đã có sẵn thiết kế)

```json
{
  "utteranceId": "u-014",
  "speakerId": "speaker-b",
  "startMs": 84210,
  "endMs": 88730,
  "verbatimText": "Chúng ta cần nộp bản nháp trước 5 giờ chiều thứ Sáu.",
  "asrConfidence": 0.87,
  "status": "final",
  "corrections": [],
  "source": "microphone-local"
}
```

### 2.2 `declutterCards` (mới — Module A)

```json
{
  "cardId": "d-003",
  "sourceType": "slide",
  "sourceImageId": "img-2026-09-21-014",
  "capturedAtMs": 1600000,
  "rawOcrText": "KẾ HOẠCH TRIỂN KHAI QUÝ 4 — Mục tiêu: tăng 20% ... (đoạn chữ dày đặc)",
  "simplifiedBlocks": [
    {"blockId": "b1", "level": "heading", "text": "Mục tiêu Quý 4", "order": 1},
    {"blockId": "b2", "level": "body", "text": "Tăng 20% khách hàng mới", "order": 2},
    {"blockId": "b3", "level": "list-item", "text": "Hạn chót: 15/12", "order": 3}
  ],
  "confidence": 0.82,
  "needsReview": true,
  "evidenceRef": "img-2026-09-21-014"
}
```

### 2.3 `communicateDrafts` (mới — Module B)

```json
{
  "draftId": "c-021",
  "triggerEvidenceIds": ["u-014", "u-015"],
  "inputMethod": "quick-phrase",
  "rawInput": "chưa xong / cần thêm thời gian",
  "suggestedPhrasing": [
    {"text": "Tôi cần thêm một ngày để hoàn thiện bản nháp, có được không?", "toneTag": "assertive-polite", "confidence": 0.9},
    {"text": "Phần này tôi chưa xong, tôi có thể gửi vào sáng thứ Hai được không?", "toneTag": "clarifying", "confidence": 0.85}
  ],
  "userApprovedText": null,
  "status": "draft",
  "ttsAudioRef": null
}
```

### 2.4 Quy tắc xác thực chung

```text
Nếu simplifiedBlocks hoặc suggestedPhrasing tồn tại
  nhưng không có evidenceRef/triggerEvidenceIds hợp lệ
→ không hiển thị như kết quả cuối
→ đánh dấu needsReview = true / status = "draft"
→ không bao giờ tự động phát TTS hoặc xuất mà chưa có userApprovedText
```

---

## 3. Module A — Declutter (AI thị giác xử lý nội dung, không xử lý con người)

### 3.1 Vấn đề giải quyết

Người neurodivergent (đặc biệt ADHD) dễ quá tải khi đọc tài liệu/slide/form mật độ cao, layout bất ngờ — pain point đã ghi trong nghiên cứu gốc (mục 3.2, hàng "Đọc tài liệu/form"). Đây **không phải** OCR đơn thuần, mà là "làm gọn có cấu trúc, có thể đọc bằng giọng nói".

### 3.2 Pipeline kỹ thuật

```text
Ảnh chụp (camera/screen-share)
   → tiền xử lý ảnh (crop, tăng tương phản, khử nghiêng)
   → OCR: Tesseract.js (gói ngôn ngữ "vie")
   → text thô + tọa độ block (bounding box giữ thứ tự đọc)
   → LLM restructure (schema JSON bắt buộc, temperature thấp)
      • input: text thô + vị trí block
      • output: simplifiedBlocks[] theo cấp độ heading/body/list-item
      • ràng buộc: không thêm nội dung không có trong text gốc
   → kiểm tra schema + đối chiếu ngược (mỗi block phải map được về đoạn text gốc)
   → hiển thị dạng card lớn, một cột, mật độ thấp
   → tùy chọn: TTS đọc từng block theo yêu cầu người dùng (không tự động đọc hết)
```

### 3.3 Lựa chọn công nghệ

| Thành phần | Ứng viên chính | Dự phòng | Ghi chú |
|---|---|---|---|
| OCR | Tesseract.js (client-side, offline) | Google Cloud Vision / Azure Computer Vision (nếu có mạng, độ chính xác cao hơn) | Cần tải sẵn `vie.traineddata`; test trước với font/slide thật của nhóm |
| Restructure | LLM có sẵn (API bất kỳ đội có quyền dùng), bắt buộc JSON mode | Rule-based: tách theo dòng trống/kích thước chữ nếu LLM lỗi | Không dùng model thị giác nặng (VLM) cho MVP — OCR+LLM ổn định hơn, ít rủi ro độ trễ |
| Khử nghiêng/crop ảnh | OpenCV.js hoặc canvas API cơ bản | Chụp thủ công đúng khung | Giữ đơn giản, ưu tiên thời gian cho phần khác |

### 3.4 Vì sao KHÔNG dùng nhận diện khuôn mặt/cảm xúc

Báo cáo nghiên cứu gốc đã liệt "ghi hình/phân tích nét mặt để suy ra emotion/attention" là anti-goal (mục 4.3) và là điểm trừ trực tiếp ở tiêu chí "Responsible AI" của BGK. Module Declutter chỉ xử lý **nội dung tài liệu**, tuyệt đối không xử lý hình ảnh khuôn mặt người dùng hay người khác trong phòng.

### 3.5 Tiêu chí chấp nhận

- Một slide dày đặc chữ → card đơn giản trong ≤ 5 giây xử lý.
- Mọi block hiển thị phải trace được về đúng vị trí trong ảnh gốc (không bịa nội dung).
- Người dùng có thể xem ảnh gốc cạnh bản đơn giản hóa bất cứ lúc nào.

---

## 4. Module B — Communicate (STT + hỗ trợ diễn đạt + TTS)

### 4.1 Vấn đề giải quyết

Người neurodivergent thường khó tổ chức câu trả lời bằng lời kịp lúc dưới áp lực xã hội của cuộc họp (executive-function demand — đã ghi trong nghiên cứu gốc, mục 3.1 và 3.2). Module này là công cụ **trao quyền diễn đạt**, không phải công cụ giám sát hay thay lời người dùng mà không xác nhận.

### 4.2 Pipeline kỹ thuật

```text
Giọng nói người khác (mic) → STT (PhoWhisper/PhoASR) → utterances[] (đã có sẵn)
                                                            │
                                                            ▼
                                        Now/Before/Next extractor (đã có sẵn thiết kế)
                                                            │
                                                            ▼
                          Người dùng bấm "Tôi cần trả lời" → mở Communicate Composer
                                                            │
              ┌─────────────────────────────┬───────────────┴───────────────┐
              ▼                             ▼                               ▼
     Chọn cụm từ mẫu (quick-phrase)   Gõ nhanh (rút gọn)          Chọn template theo tình huống
     ("cần thêm thời gian",          ("chưa xong")                 ("xin làm rõ", "từ chối lịch sự",
      "chưa hiểu rõ", "đồng ý"...)                                  "đề xuất thời gian khác")
              └─────────────────────────────┴───────────────┬───────────────┘
                                                              ▼
                                        LLM tone-check/rephrase (tùy chọn, có thể tắt)
                                        → 1–2 phương án diễn đạt lịch sự, rõ ràng
                                                              ▼
                                    Người dùng XEM TRƯỚC, chỉnh sửa hoặc chọn nguyên văn
                                                              ▼
                                        userApprovedText được ghi lại (bắt buộc bước này)
                                                              ▼
                                              TTS phát ra loa (giọng tiếng Việt tự nhiên)
```

**Ranh giới đạo đức quan trọng:** hệ thống chỉ **gợi ý**, không bao giờ tự động phát TTS hoặc gửi tin nhắn nếu `userApprovedText` còn null. Đây là bản mở rộng trực tiếp của quy tắc "Rules first, AI second, user has the last word" đã đặt ra trong nghiên cứu gốc.

### 4.3 Lựa chọn công nghệ

| Thành phần | Ứng viên chính | Dự phòng | Ghi chú |
|---|---|---|---|
| STT | PhoASR-whisper-small hoặc PhoWhisper-base (đã benchmark trong nghiên cứu trước) | Whisper đa ngôn ngữ qua faster-whisper | Giữ nguyên lựa chọn đã có, không đổi |
| TTS tiếng Việt | Web Speech API (`speechSynthesis`, có sẵn trình duyệt, offline, giọng máy) cho MVP nhanh | FPT.AI TTS API hoặc Google Cloud/Azure TTS (giọng tự nhiên hơn, cần mạng + key) | Test trước giọng đọc trên đúng trình duyệt/máy demo — chất lượng giọng Việt của Web Speech API khác nhau theo OS |
| Quick-phrase bank | Danh sách tĩnh soạn trước (JSON), phân loại theo tình huống họp | — | Đây là phần **nội dung** nên chuẩn bị kỹ trước — không cần AI, chỉ cần UX tốt |
| Tone-check | LLM có sẵn, prompt cố định, chỉ paraphrase không đổi ý | Tắt hẳn bước này nếu latency/API không ổn định | Luôn có phương án "bỏ qua, dùng nguyên văn người dùng gõ" |

### 4.4 Bộ cụm từ mẫu nên soạn trước (không cần AI, làm ngay được)

Đây là phần **an toàn tuyệt đối để chuẩn bị trước**, vì là nội dung tĩnh, không phụ thuộc bài toán cụ thể của Ngày 1:

- Nhóm "cần thêm thời gian/làm rõ": "Tôi cần thêm thời gian để trả lời câu này", "Bạn có thể nhắc lại phần trước không?", "Tôi chưa nắm rõ hạn chót là khi nào."
- Nhóm "xác nhận/đồng ý": "Tôi đồng ý với phương án này", "Tôi sẽ phụ trách phần này."
- Nhóm "từ chối/điều chỉnh lịch sự": "Tôi nghĩ thời hạn này hơi gấp, có thể lùi lại không?", "Tôi cần trao đổi thêm trước khi quyết định."
- Nhóm "yêu cầu nghỉ/tạm dừng": "Tôi cần 2 phút để sắp xếp lại suy nghĩ."

### 4.5 Tiêu chí chấp nhận

- Từ lúc bấm "Tôi cần trả lời" đến khi có ≥1 gợi ý cụm từ: ≤ 2 giây (không chờ LLM nếu dùng quick-phrase tĩnh).
- TTS không bao giờ phát nếu chưa qua bước xác nhận của người dùng.
- Toàn bộ thao tác dùng được bằng bàn phím/phím tắt (người dùng có thể đang căng thẳng, cần thao tác nhanh, ít click).

---

## 5. Hạ tầng dùng chung (Shared Infrastructure)

| Thành phần | Vai trò | Ghi chú |
|---|---|---|
| Evidence Store (SQLite/IndexedDB) | Lưu utterances, declutterCards, communicateDrafts, corrections | Append-only; xuất/xóa rõ ràng theo yêu cầu người dùng |
| UI Design Token Kit | Mật độ, giảm chuyển động, cỡ chữ, tương phản — dùng chung cho cả 3 chế độ hiển thị (DHH/Focus/Combined) và 2 panel mới | Đã có khung từ nghiên cứu gốc mục 6.2–6.3, chỉ cần mở rộng thêm 2 panel |
| Schema Validator | Kiểm tra mọi output AI (JSON) trước khi hiển thị | Dùng chung cho cả 3 luồng: Now/Before/Next, Declutter, Communicate |
| Local-first storage | Không upload audio/ảnh gốc lên cloud mặc định | Consent screen dùng chung, chỉ báo trạng thái ghi luôn hiển thị |

---

## 6. Phân công 3 thành viên theo module

| Vai trò | Trách nhiệm chính | Module liên quan |
|---|---|---|
| Product/A11y lead | Soạn quick-phrase bank, UX copy, kiểm tra bàn phím/khả năng tiếp cận, kịch bản demo | Communicate (nội dung), toàn bộ UX |
| Frontend/realtime lead | Lớp thu nhận (mic/camera/screen-share), renderer, audio playback, state management | Declutter panel UI, Communicate composer UI |
| AI/backend lead | STT/OCR/LLM service, schema validator, TTS integration, evidence store | Cả 2 module ở lớp xử lý |

---

## 7. Kế hoạch chuẩn bị trước (16–20/09/2026)

| Ngày | Việc làm | Rủi ro cần né |
|---|---|---|
| 16–17/09 | Dựng evidence store + schema; tích hợp OCR (Tesseract.js) + test trên 3–5 slide/tài liệu thật; soạn quick-phrase bank | Đừng code UI cuối cùng — layout có thể đổi theo brief thật |
| 18/09 (sau 11h, sau họp bắt buộc) | Đối chiếu kiến trúc này với brief vừa nghe được; điều chỉnh persona/kịch bản nếu cần | Không bỏ qua họp bắt buộc 10–11h |
| 19/09 | Benchmark STT/TTS trên đúng laptop demo; test LLM restructure/tone-check với schema validator | Không phụ thuộc hoàn toàn vào 1 API — luôn có fallback tĩnh |
| 20/09 | Diễn tập toàn bộ pipeline 3 lần liên tục (declutter 1 slide + communicate 1 tình huống); chuẩn bị fixture dự phòng offline | Không để tối 20/09 mới cài đặt môi trường |

---

## 8. Rủi ro và tiêu chí dừng (kill criteria) riêng cho 2 module

| Rủi ro | Biện pháp |
|---|---|
| OCR sai nhiều với slide tiếng Việt có dấu | Test sớm với font/tài liệu thật của đội; nếu tệ, giảm phạm vi Declutter xuống chỉ còn text đã có sẵn (dán/copy) thay vì OCR ảnh |
| TTS giọng Việt nghe không tự nhiên/robot | Chấp nhận nếu đây không phải trọng tâm demo; ưu tiên tính đúng/tính năng hơn chất lượng giọng |
| LLM restructure bịa thêm nội dung không có trong OCR | Bắt buộc bước đối chiếu ngược (mỗi block phải trace về text gốc); nếu không đối chiếu được, bỏ generative, dùng rule-based tách theo dòng/kích thước chữ |
| Communicate bị hiểu lầm là "AI nói thay người dùng" | Luôn hiển thị rõ "Đây là gợi ý — bạn xác nhận trước khi phát"; không bao giờ auto-play |
| Brief Ngày 1 không khớp 2 module này | Vì kiến trúc là evidence-layer + renderer tổng quát, có thể tái dùng lớp bằng chứng/UI kit cho hướng khác mà không mất công đã làm |

---

## 9. Việc KHÔNG làm trước Ngày 1

- Không viết cố định câu chuyện pitch/kịch bản demo 100% — brief thật có thể đổi barrier cụ thể.
- Không xin quyền truy cập dataset hạn chế (không còn cần thiết vì DHH không phải track được giao).
- Không xây tính năng suy luận trạng thái nội tâm người dùng từ camera/giọng nói.
- Không hứa hẹn tính năng "chẩn đoán" hay khung ngôn ngữ mang tính y tế.
