# Báo cáo Nghiên cứu Chuyên sâu — Người Điếc/Khiếm thính (DHH) + Người có Thần kinh đa dạng (Neurodivergence)

**ADC Hackathon 2026 | Bản nghiên cứu chuyên sâu phục vụ quyết định sản phẩm và PoC**
**Ngày khóa nghiên cứu:** 08/09/2026
**Bối cảnh:** hackathon trực tiếp 3 ngày, video/pitch dưới 5 phút, trọng tâm AI & Employability (Việc làm) tại Việt Nam.

> **Kết luận một câu:** Đừng làm thêm một ứng dụng "speech-to-text" hay một trợ lý productivity chung chung. Hãy xây **SignalFlow — một dòng thời gian bằng chứng (evidence timeline) của cuộc họp với nhiều chế độ hiển thị do người dùng kiểm soát**, giúp người Điếc/Khiếm thính (DHH) tiếp nhận đúng nội dung và giúp người có thần kinh đa dạng (neurodivergent) giữ hoặc khôi phục mạch hội thoại mà không bị quá tải.

---

## 0. Tóm tắt quyết định dành cho lãnh đạo (Executive Decision Brief)

### Lựa chọn chiến lược

**Hai lĩnh vực:** Người Điếc/Khiếm thính (Deaf or Hard of Hearing — DHH) + Người có thần kinh đa dạng (Neurodivergence).
**Job-to-be-done chung (việc cần hoàn thành):** tham gia bình đẳng vào cuộc họp, đào tạo và cộng tác tại nơi làm việc khi thông tin đến quá nhanh, sai phương thức (modality), thiếu ngữ cảnh hoặc phân tán trên quá nhiều điểm chú ý.
**Sản phẩm chủ lực:** **SignalFlow — "Một cuộc hội thoại, nhiều chế độ xem có thể tiếp cận."**
**Mức khả thi ước lượng:** 8/10 nếu đóng đúng phạm vi (scope); 5/10 nếu cố làm dịch ngôn ngữ ký hiệu liên tục (continuous sign-language translation), nhận diện cảm xúc (emotion detection) hoặc phân tách người nói (diarization) hoàn hảo.

Lựa chọn này khớp trực tiếp với đề bài ADC 2026: hackathon diễn ra **21–23/09/2026**, chủ đề **AI & Việc làm (Employability)**, yêu cầu đội 3 người và chấm theo các tiêu chí Đổi mới & Tác động (Innovation & Impact), Thiết kế lấy người dùng làm trung tâm & Khả năng tiếp cận (User-Centred Design & Accessibility), Tính khả thi & Thực tiễn (Feasibility & Practicality), Ứng dụng AI (Use of AI), cùng Trình bày & Truyền đạt (Presentation & Communication) ở vòng cuối. [ADC Hackathon 2026 — RMIT Vietnam](https://industryhub.rmit.edu.vn/ADC/).

### Vì sao hai lĩnh vực này kết hợp tự nhiên

Hai cộng đồng không có cùng nhu cầu, và cũng không nên bị gom thành một persona. Tuy nhiên, trong các cuộc họp/làm việc kết hợp (hybrid work), họ thường gặp cùng một **điểm gãy thông tin**:

```text
Âm thanh trực tiếp, nhanh, chồng lấn, biến mất ngay
                  │
        ┌─────────┴─────────┐
        │                   │
 DHH: không nghe đủ      Người thần kinh đa dạng: khó lọc,
 hoặc không rõ ai nói    chuyển chú ý, giữ working memory
        │                   │
        └─────────┬─────────┘
                  ↓
 Cần một dòng bằng chứng (evidence timeline) có người nói, mốc thời gian, chỉnh sửa
                  ↓
   Chế độ DHH / Chế độ Tập trung / Chế độ Kết hợp theo lựa chọn cá nhân
```

W3C lưu ý caption đồng bộ vẫn có thể tạo rào cản cho một số người có khó khăn đọc/xử lý vì người xem phải chia chú ý giữa video và chữ; bản ghi đầy đủ (transcript) hỗ trợ xem lại và đọc theo tốc độ riêng nhưng **không thay thế** caption thời gian thực. W3C cũng chỉ ra công cụ cộng tác có thể trở nên quá tải về nhận thức khi hội nghị truyền hình (teleconference), nhiều người không thể theo dõi nhiều vị trí cập nhật cùng lúc, và việc tuân thủ WCAG riêng lẻ chưa đủ giải quyết toàn bộ vấn đề cộng tác. [Media Accessibility User Requirements](https://www.w3.org/TR/media-accessibility-reqs/), [Collaboration Tools Accessibility User Requirements](https://www.w3.org/TR/ctaur/).

### Phạm vi phải giữ

| BẮT BUỘC trong PoC | NÊN CÓ nếu pipeline ổn định | KHÔNG LÀM trong 3 ngày |
|---|---|---|
| Caption tiếng Việt trực tiếp (streaming); bản ghi bất biến; mốc thời gian; chỉnh sửa (correction); chú giải thuật ngữ (glossary); "Tôi mất mạch"; 2 chế độ hiển thị; dự phòng ngoại tuyến | Gán người nói (speaker attribution) đơn giản; nhãn âm thanh có ý nghĩa; bản tóm tắt LLM có bằng chứng; xử lý ưu tiên cục bộ (local-first) | Chẩn đoán ADHD/tự kỷ; chấm điểm cảm xúc/mức độ chú ý; dịch ngôn ngữ ký hiệu Việt Nam (VSL) liên tục; cảnh báo khẩn cấp được chứng nhận; tự động tạo task/email không xác nhận |

### Quy tắc sản phẩm

1. **Quy tắc trước, AI sau, người dùng có tiếng nói cuối cùng.**
2. Bản ghi gốc là bằng chứng; bản tóm tắt không được âm thầm ghi đè nó.
3. Mỗi phát biểu suy diễn phải dẫn về `evidenceId`/mốc thời gian hoặc hiển thị "Không chắc".
4. Không suy luận khuyết tật, cảm xúc, mức chú ý hay năng suất từ giọng nói, camera hoặc dữ liệu clickstream.
5. Cá nhân hóa là quyền chọn của người dùng, không phải hồ sơ do hệ thống gắn nhãn.

---

# 1. Khung nghiên cứu và mức tin cậy

## 1.1 Câu hỏi quyết định

1. Trong giao tiếp tại nơi làm việc, đâu là điểm đau (pain point) đủ chung để dùng chung tech stack nhưng vẫn giải quyết đúng nhu cầu riêng của người DHH và người thần kinh đa dạng?
2. Cơ sở thị trường (baseline) đã làm được gì, và khoảng trống nào còn đủ mới để thuyết phục ban giám khảo (BGK)?
3. AI nào mang lại giá trị quan sát được trong 3–5 phút mà không biến demo thành canh bạc về độ trễ (latency)/ảo giác (hallucination)?
4. Dữ liệu/model tiếng Việt nào có thể dùng hợp pháp và triển khai trong thời gian hackathon?
5. Chỉ số nào chứng minh khả năng tiếp cận (accessibility) tốt hơn thay vì chỉ "trông thông minh"?

## 1.2 Phương pháp và giới hạn

- Ưu tiên nguồn chính thống: RMIT/ADC, W3C, WHO, thẻ mô tả model (model card)/kho lưu trữ chính thức, bài báo gốc và trang dataset chính thức.
- Tách rõ **bằng chứng nguồn** khỏi **khuyến nghị phân tích**. Điểm số, ngân sách độ trễ (latency budget) và phạm vi là đánh giá chủ quan (judgment) cho một đội 3 người, không phải kết quả thử nghiệm lâm sàng.
- Nghiên cứu quốc tế được dùng để định hình rào cản và kiến trúc; chưa thay thế phỏng vấn người dùng DHH/thần kinh đa dạng tại Việt Nam.
- "Thần kinh đa dạng" (Neurodivergence) là một khái niệm rộng, không phải một chẩn đoán duy nhất. Báo cáo tập trung vào việc chuyển đổi sự chú ý, trí nhớ làm việc (working memory), tải xử lý, khả năng dự đoán và tải giác quan trong công việc; không tuyên bố đại diện mọi người mắc ADHD/tự kỷ/khó đọc (dyslexic).
- Báo cáo không đánh giá giá trị con người hoặc xếp hạng cộng đồng; điểm chỉ đo rủi ro của bản thử nghiệm (PoC).

## 1.3 Điều mới so với vòng nghiên cứu trước

| Cập nhật mới | Ý nghĩa đối với quyết định |
|---|---|
| W3C CTAUR 2025 về khả năng tiếp cận của công cụ cộng tác | Xác nhận vấn đề không chỉ là độ chính xác caption; cập nhật đa vị trí, thông báo và nhu cầu nhận thức là rào cản mang tính hệ thống |
| CapTune, ASSETS 2025 | Củng cố thiết kế caption có tùy biến do người xem kiểm soát; sự phong phú (richness) và tải nhận thức (cognitive load) có sự đánh đổi |
| EvolveCaptions, ASSETS 2025 | Cho thấy việc chỉnh sửa/cộng tác có thể trở thành một phần trải nghiệm, không chỉ là hậu xử lý |
| PhoASR-whisper-small, PhoWhisper và VietASR | Có nhiều đường nhận dạng giọng nói (ASR) tiếng Việt mã nguồn mở đáng để benchmark; model 2026 thêm mốc thời gian theo từ nhưng vẫn cảnh báo hạn chế về giọng vùng miền/thuật ngữ hiếm |
| Common Voice scripted v26/spontaneous v4 (06/2026) | Nguồn dữ liệu giọng nói mở tiếp tục được cập nhật; hữu ích cho benchmark, nhưng phải kiểm tra tập con (subset)/giấy phép tại thời điểm tải |
| VSL400, Scientific Data 08/2026 | Tài nguyên ngôn ngữ ký hiệu Việt Nam (VSL) tiến bộ rõ, nhưng vẫn là dataset từ đơn lẻ (isolated-word) và quyền truy cập có kiểm soát; không nên là đường găng (critical path) của PoC |

---

# 2. Nghiên cứu chuyên sâu — Người Điếc/Khiếm thính (DHH)

## 2.1 Không bắt đầu từ giả định "DHH = cần phụ đề"

DHH bao gồm một phổ trải nghiệm rất khác nhau: người Điếc (Deaf), khiếm thính (hard of hearing), điếc muộn (late-deafened); người dùng ngôn ngữ ký hiệu hoặc không; người dùng máy trợ thính (hearing aid)/cấy ốc tai điện tử (cochlear implant) hoặc không; khả năng đọc ngôn ngữ viết, sở thích và bản sắc cá nhân cũng khác nhau. W3C ghi nhận rào cản từ âm thanh không có caption/bản ghi, dịch vụ chỉ dùng giọng nói (voice-only) và thiếu phiên dịch ngôn ngữ ký hiệu, đồng thời không coi một phương thức (modality) là phù hợp cho tất cả. [W3C — Auditory disabilities](https://www.w3.org/WAI/people-use-web/abilities-barriers/auditory/).

Caption đúng không chỉ là chuỗi chữ. Với nội dung media, W3C yêu cầu nội dung tương đương phải bao gồm lời thoại, xác định người nói khi cần và thông tin âm thanh phi ngôn ngữ có ý nghĩa. [W3C — Captions (Prerecorded)](https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html), [W3C — Captions/Subtitles](https://www.w3.org/WAI/media/av/captions/).

## 2.2 Bản đồ điểm đau theo hành trình nhân viên (employee journey)

| Giai đoạn | Rào cản thực tế | Hậu quả với khả năng có việc làm | Cơ sở hiện tại (Baseline) | Khoảng trống đáng làm |
|---|---|---|---|---|
| Tuyển dụng/phỏng vấn qua điện thoại | Cuộc gọi chỉ có giọng nói, tên riêng và thuật ngữ chuyên ngành bị ASR nhận sai | Bỏ lỡ câu hỏi, phải tự công khai tình trạng khuyết tật/đòi hỏi hỗ trợ | Caption cuộc gọi điện thoại/caption trực tiếp | Chú giải thuật ngữ theo công việc, mức độ không chắc chắn, chỉnh sửa nhanh, kênh thay thế |
| Đào tạo hội nhập (onboarding) | Video thiếu caption chuẩn; người đào tạo nói trong khi đang chỉ vào slide | Không nắm quy trình hoặc phụ thuộc đồng nghiệp | Caption tự động, bản ghi | Liên kết người nói/ngữ cảnh, tìm kiếm/mốc thời gian, bằng chứng lưu trữ lâu dài |
| Họp đứng hằng ngày (stand-up) | Người nói nhanh, đổi lượt, nói chồng chéo | Mất quyền sở hữu công việc/hạng mục hành động | Caption của Meet/Teams/Zoom | Ai nói, điều gì được quyết định, đoạn nào không chắc chắn |
| Họp kết hợp (hybrid) | Người trong phòng xa micro; âm thanh trong phòng/từ xa lệch nhau | Người tham gia từ xa bị đứng ngoài nhịp thảo luận | Ghi bản hội nghị (conference transcription) | Chỉ báo chất lượng micro, vòng lặp chỉnh sửa, dòng thời gian có cấu trúc |
| Công việc không chính thức | Trao đổi ngoài hành lang/âm thanh báo hiệu | Thiếu "thông tin ngẫu nhiên" và cơ hội kết nối | Live Transcribe trên điện thoại/cảnh báo âm thanh | Ngữ cảnh, mức ưu tiên, quyền riêng tư; không báo động giả quá mức |
| Sau cuộc họp | Bản ghi dài, sai tên riêng; không rõ quyết định | Tốn công xác minh, rủi ro về trách nhiệm giải trình | Bản tóm tắt AI thông thường | Tóm tắt gắn với bằng chứng; hành động được người dùng xác nhận; nhật ký kiểm tra (audit trail) |

### "Khoảng trống chí mạng" của thị trường

Android Live Transcribe đã cung cấp bản ghi thời gian thực, nhãn âm thanh, từ tùy chỉnh và một số khả năng ngoại tuyến; Microsoft Teams có caption trực tiếp, CART (dịch vụ phiên âm thời gian thực), chỉnh phông chữ/màu/vị trí/số dòng, nhưng caption không được lưu nếu không bật tính năng ghi bản riêng; Apple Live Captions cũng là một cơ sở mạnh và chính Apple cảnh báo độ chính xác có thể thay đổi, không dùng cho tình huống rủi ro cao. Vì vậy **một ứng dụng chỉ đổi giọng nói thành chữ gần như không có luận điểm sản phẩm (product thesis) mới**. [Android Live Transcribe](https://support.google.com/accessibility/android/answer/9158064?hl=en), [Microsoft Teams live captions](https://support.microsoft.com/en-us/teams/meetings/use-live-captions-in-microsoft-teams-meetings), [Apple Live Captions](https://support.apple.com/en-by/guide/iphone/iphe0990f7bb/ios).

Khoảng trống có giá trị hơn là:

- **Niềm tin (Trust):** từ nào không chắc, người dùng sửa thế nào, việc chỉnh sửa có được áp dụng cho lần sau không?
- **Ngữ cảnh (Context):** ai nói, lúc nào, liên quan đến slide/hành động nào, âm thanh nào thực sự có nghĩa?
- **Quyền tự chủ (Agency):** người dùng chọn độ dày caption, vị trí, kích thước, loại tín hiệu âm thanh (sound cue); không bị người tạo nội dung/AI áp một bố cục cố định.
- **Tính liên tục (Continuity):** khi bỏ lỡ một đoạn, có thể khôi phục mạch mà không cần giơ tay yêu cầu cả phòng nói lại.
- **Quyền riêng tư (Privacy):** âm thanh cuộc họp không mặc định bị đưa lên đám mây hoặc lưu vô hạn.

## 2.3 Công nghệ và mức độ sẵn sàng

| Thành phần | Ứng viên | Mức sẵn sàng cho PoC | Lưu ý quyết định |
|---|---|---:|---|
| ASR tiếng Việt — ứng viên 2026 | **PhoASR-whisper-small** qua Transformers | Cao | 0,2 tỷ tham số; có mốc thời gian theo từ; giấy phép BSD-3-Clause-Clear + Qualcomm Responsible AI License; thẻ model cảnh báo giọng miền Trung và thuật ngữ hiếm |
| ASR tiếng Việt — đường đơn giản | **PhoWhisper-base/small** | Cao | Giấy phép BSD-3-Clause; tinh chỉnh (fine-tune) Whisper đa ngôn ngữ trên 844 giờ dữ liệu; tích hợp nhanh, vẫn phải benchmark trên miền dữ liệu thực tế |
| ASR tiếng Việt — đường tham vọng | **VietASR** checkpoint/pipeline Zipformer | Trung bình | Giấy phép Apache-2.0; kho lưu trữ công bố checkpoint từ 70.000 giờ dữ liệu gán nhãn giả (pseudo-labeled); cài đặt icefall/k2 phức tạp hơn |
| Phát hiện hoạt động giọng nói (VAD) | Silero VAD/WebRTC VAD | Cao | Dùng để chia đoạn (chunking)/xác định điểm cuối (endpointing); không coi khoảng lặng là "không chú ý" |
| Gán người nói (Speaker attribution) | pyannote.audio hoặc nút chọn người nói/đăng ký người nói đã biết | Trung bình | Phân tách người nói (diarization) trực tiếp dễ bị trễ; trong demo nên có phương án dự phòng thủ công/người nói đã biết |
| Âm thanh có ý nghĩa | YAMNet/TFLite hoặc ONNX | Cao | 521 lớp trong AudioSet; chỉ bật danh sách cho phép (allowlist) gồm 3–5 âm thanh, không làm còi báo an toàn |
| Truyền tải bản ghi | WebRTC/getUserMedia + AudioWorklet + WebSocket | Cao | Làm nóng model trước (prewarm), bộ đệm vòng (ring buffer), chiến lược kết nối lại |
| Suy luận cục bộ (Local inference) | ONNX Runtime Web/WebGPU hoặc dịch vụ Python cục bộ | Trung bình–Cao | Hỗ trợ trình duyệt/phần cứng thay đổi; dịch vụ cục bộ ổn định hơn cho sân khấu |
| Dữ liệu đánh giá | Common Voice tiếng Việt + fixture cuộc họp trong miền dữ liệu thực | Cao | Common Voice để benchmark độ đa dạng; fixture riêng để đo tên riêng/thuật ngữ chuyên ngành/từ vựng công sở |

Nguồn: [PhoASR-whisper-small model card](https://huggingface.co/Qualcomm-AI-Research/PhoASR-whisper-small), [PhoASR paper — EACL 2026](https://aclanthology.org/2026.findings-eacl.345/), [PhoWhisper model card](https://huggingface.co/vinai/PhoWhisper-base/blob/main/README.md), [VietASR official repository](https://github.com/zzasdf/VietASR), [Common Voice datasets](https://commonvoice.mozilla.org/en/datasets), [YAMNet](https://www.tensorflow.org/hub/tutorials/yamnet), [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/).

### Ngôn ngữ ký hiệu Việt Nam (VSL): đáng theo dõi, không nên làm MVP

VSL400 công bố tháng 08/2026 gồm 74.259 clip, 400 gloss (ký hiệu quy chuẩn) và 28 người ký hiệu, là bước tiến quan trọng cho nhận dạng Ngôn ngữ ký hiệu Việt Nam. Tuy nhiên đây là bài toán **nhận dạng từ đơn lẻ (isolated-word recognition)**, quyền truy cập video có kiểm soát theo Thỏa thuận Sử dụng Dữ liệu (Data Use Agreement), khác xa bài toán dịch liên tục, có phối hợp cấu âm (coarticulated) và giàu ngữ cảnh trong phòng họp. [VSL400 record](https://zenodo.org/records/17943574), [VSL400 — Scientific Data](https://www.nature.com/articles/s41597-026-08040-2).

Quyết định: không làm "bộ dịch VSL vạn năng". Nếu đội có cộng tác viên Điếc/sử dụng VSL và muốn thêm yếu tố VSL, chỉ nên dùng **video ký hiệu phản hồi được tuyển chọn (curated)** hoặc bộ từ vựng 10–20 cụm từ được cộng đồng kiểm duyệt, không đặt nó trên đường găng.

## 2.4 Rủi ro đặc thù của DHH và biện pháp giảm thiểu

| Rủi ro | Xác suất/Ảnh hưởng | Biện pháp giảm thiểu trong hackathon |
|---|---|---|
| ASR sai tên riêng/thuật ngữ chuyên ngành/giọng vùng miền | Cao/Cao | Chú giải thuật ngữ theo công việc; đánh dấu độ tin cậy; chỉnh sửa; fixture tiếng Việt; benchmark trên 20 thuật ngữ chính |
| Caption trễ làm người dùng tụt nhịp | Trung–Cao/Cao | Chia đoạn nhỏ; hiển thị caption tạm thời (partial); huy hiệu độ trễ (latency badge); không chờ LLM mới hiển thị bản ghi |
| Nói chồng chéo làm sai người nói | Cao/Trung–Cao | 2 người nói đã biết trước; chip nhận diện thủ công/đẩy để xác định; nói rõ giới hạn |
| Thông tin "âm thanh" gây nhiễu | Trung/Trung | Danh sách cho phép, mức ưu tiên và tạm ẩn (snooze); người dùng chọn tín hiệu; không hiển thị mọi lớp của YAMNet |
| Tóm tắt AI sửa sai lời gốc | Trung/Cao | Bản ghi bất biến; mã bằng chứng (evidenceId); bản tóm tắt ở lớp riêng; xác nhận trước khi xuất |
| Ghi âm không có sự đồng ý | Trung/Cao | Màn hình xin đồng ý; chỉ báo luôn hiển thị; âm thanh gốc mặc định không lưu; kiểm soát Xóa/thời gian lưu trữ |

---

# 3. Nghiên cứu chuyên sâu — Người có thần kinh đa dạng (Neurodivergence)

## 3.1 Tránh thiết kế theo khuôn mẫu (stereotype)

W3C mô tả khả năng tiếp cận về nhận thức (cognitive accessibility) qua nhiều chức năng như sự chú ý, trí nhớ, ngôn ngữ, nhận thức giác quan, giải quyết vấn đề và khả năng hiểu; WHO nhấn mạnh trải nghiệm và nhu cầu của người tự kỷ (autistic) rất đa dạng. Một chế độ "chế độ ADHD" cố định vừa thiếu chính xác vừa có nguy cơ kỳ thị hóa (stigmatize). [W3C Cognitive Accessibility](https://www.w3.org/WAI/cognitive/), [WHO — Autism](https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders).

Thiết kế đúng là cung cấp các **điều khiển chức năng**: giảm chuyển động, hạ mật độ thông tin, gom thông báo, giữ vị trí bố cục, diễn giải thay đổi, xem từng bước một, xem bằng chứng — người dùng tự chọn, không phải chứng minh chẩn đoán.

Bằng chứng về nơi làm việc mới năm 2026 cũng đẩy vấn đề ra khỏi mô hình "khiếm khuyết của cá nhân": một nghiên cứu có sự tham gia (participatory) với 20 người trưởng thành tự kỷ tại Singapore ghi nhận nơi làm việc thường mặc định theo các chuẩn mực thần kinh điển hình (neurotypical), tạo khó khăn từ chỉ dẫn mơ hồ, đòi hỏi cao về chức năng điều hành (executive function) và quy tắc giao tiếp ngầm; người tham gia quan tâm đến việc AI hỗ trợ cấu trúc hóa và sự thấu hiểu lẫn nhau. Đây là tín hiệu thiết kế có giá trị cho bối cảnh châu Á, nhưng mẫu nghiên cứu nhỏ và không đại diện cho Việt Nam. [Kan et al., Frontiers in Psychiatry, 2026](https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2026.1825357/full).

## 3.2 Bản đồ điểm đau theo hành trình nhân viên

| Giai đoạn | Rào cản thực tế | Hậu quả với khả năng có việc làm | Cơ sở hiện tại | Khoảng trống đáng làm |
|---|---|---|---|---|
| Chuẩn bị họp | Chương trình họp (agenda) mơ hồ, đổi lịch bất ngờ | Tăng chi phí chuyển đổi trạng thái (transition cost)/lo âu; vào họp thiếu ngữ cảnh | Nhắc lịch (calendar reminder) | "Điều gì thay đổi / điều gì giữ nguyên / điều gì tiếp theo" |
| Trong khi họp | Vừa nghe + đọc chat + xem slide + ghi chú + xem hình ảnh chính mình | Quá tải nhận thức/giác quan, mất mạch | Bản ghi, làm mờ nền, chế độ tập trung | Một điểm nhìn duy nhất, ngân sách thông báo, tính liên tục trạng thái |
| Bị gián đoạn | Chủ đề đổi khi sự chú ý rời đi | Không biết đang ở đâu, ngại hỏi lại | Bản tóm tắt AI thông thường | "Hiện tại / Trước đó / Tiếp theo" có mốc thời gian |
| Nhận hạng mục hành động | Ngôn ngữ ngầm ẩn, không rõ hạn chót/người phụ trách | Khó khởi động công việc (task initiation), sai kỳ vọng | Ghi chú/công cụ quản lý task bằng AI | Hành động gắn với bằng chứng + con người xác nhận |
| Đọc tài liệu/biểu mẫu | Mật độ thông tin cao, giao diện bất ngờ, hết giờ (timeout)/lỗi mơ hồ | Tốn thời gian, bỏ dở công việc | Chế độ đọc, tiện ích mở rộng | Hiển thị tăng dần có thể đảo ngược, giữ nguyên bản/trạng thái |
| Thông báo/trò chuyện | Nhiều thông báo ngang hàng nhau | Chuyển đổi ngữ cảnh liên tục | Chế độ Không làm phiền (Do Not Disturb) | Ưu tiên, gom nhóm, ẩn/xác nhận theo sở thích |

Nghiên cứu của Microsoft với người trưởng thành tự kỷ trong gọi video chỉ ra sự nhạy cảm giác quan, tải nhận thức và lo âu định hình lựa chọn kênh giao tiếp; người tham gia phải chủ động điều tiết đầu vào và xây dựng chiến lược đối phó. Một nghiên cứu về họp kết hợp (hybrid) với 21 chuyên gia có khuyết tật (bao gồm người DHH và thần kinh đa dạng) mô tả rõ việc chia sẻ sự chú ý, âm thanh chồng chéo (cross-talk) và nhiều luồng hội thoại tạo thêm "thuế tiếp cận" (access tax). W3C CTAUR cũng nêu việc cộng tác trong hội nghị truyền hình có thể trở nên gánh nặng về nhận thức, nhiều người không theo dõi được nhiều vị trí đồng thời. [Microsoft Research — Managing Stress](https://www.microsoft.com/en-us/research/publication/managing-stress-the-needs-of-autistic-adults-in-video-calling/), [Alharbi et al. — Accessibility Barriers, Conflicts, and Repairs](https://doi.org/10.1145/3544548.3581541), [author PDF](https://www.microsoft.com/en-us/research/uploads/prod/2024/06/RahafPaper.pdf), [W3C CTAUR](https://www.w3.org/TR/ctaur/).

Nghiên cứu CHI 2025 với 20 người tự nhận mắc ADHD cho thấy caption, tốc độ phát lại và điều hướng theo mốc thời gian có thể hỗ trợ, nhưng sở thích đối với việc tô sáng động (dynamic highlighting) trái chiều: có người cần kích thích/tô sáng từ, người khác thấy chính nó gây xao nhãng. Kết luận an toàn là **cho người dùng chọn kiểu hiển thị/tốc độ**, không xây một "cấu hình mặc định ADHD" duy nhất. [Jiang et al. — Shifting the Focus](https://lucyajiang.github.io/files/papers/CHI25-ADHDVideo.pdf).

## 3.3 Khoảng trống quyết định: tính liên tục về nhận thức (cognitive continuity)

Các cơ sở hiện tại như chế độ đọc, cài đặt tập trung, bản ghi và tóm tắt thông thường chỉ xử lý từng lát cắt riêng lẻ. Khoảng trống mạnh nhất là một lớp luôn trả lời, theo yêu cầu người dùng:

```text
HIỆN TẠI   Cuộc trao đổi đang ở chủ đề nào?
TRƯỚC ĐÓ   Quyết định quan trọng ngay trước khi tôi mất mạch là gì?
TIẾP THEO  Bước nhỏ kế tiếp, người phụ trách/hạn chót nào đã được nói rõ?
NGUỒN      Tôi kiểm tra lại ở mốc thời gian nào?
```

Khác biệt cốt lõi với chatbot tóm tắt thông thường:

- Không ép người dùng đọc một đoạn văn mới.
- Chỉ xuất tối đa 1–3 dòng theo nguyên tắc hiển thị tăng dần (progressive disclosure).
- Mọi dòng có mốc thời gian nguồn; không có bằng chứng thì từ chối trả lời (abstain).
- Bản ghi chính xác (exact transcript) vẫn tồn tại cạnh bản đơn giản hóa.
- Người dùng quyết định phông chữ, mật độ, chuyển động, âm thanh, tự động cuộn (auto-scroll) và thông báo.

## 3.4 Công nghệ và mức độ sẵn sàng

| Thành phần | Cách làm đề xuất | Mức sẵn sàng | Rào chắn an toàn (Guardrail) |
|---|---|---:|---|
| Cửa sổ chủ đề (Topic window) | Cửa sổ trượt + đánh dấu tạm dừng/chủ đề + câu trích xuất | Cao | Dùng quy tắc (rules) làm phương án dự phòng |
| Bản tóm tắt có cấu trúc | LLM trả về JSON `{now,before,next,evidenceIds,confidence}` | Cao | Kiểm tra theo schema; từ chối tuyên bố không có bằng chứng |
| Trích xuất hành động | Quy tắc + ứng viên từ LLM; người dùng xác nhận người phụ trách/hạn chót | Cao | Không tự động tạo task/gửi tin nhắn |
| Giao diện ít kích thích | Token CSS, giảm chuyển động, các mức mật độ, một cột duy nhất | Cao | Không đặt tên cấu hình theo chẩn đoán |
| Kiểm soát thông báo | Ưu tiên + gom nhóm + xác nhận + tạm ẩn | Cao | Không dùng tối ưu hóa mức độ tương tác (engagement) |
| Lưu trữ cục bộ | IndexedDB/bộ nhớ đệm cục bộ mã hóa/phiên tạm thời | Cao | Xuất/xóa dữ liệu rõ ràng theo yêu cầu |
| AI trên trình duyệt/cục bộ | ONNX Runtime Web, Transformers.js hoặc backend cục bộ | Trung bình | Nạp trước model (pre-cache); dự phòng bằng quy tắc/trích xuất |

W3C COGA là hướng dẫn bổ sung vượt ra ngoài việc tuân thủ thuần túy, nhấn mạnh mục đích rõ ràng, các mẫu quen thuộc, sự trợ giúp, đơn giản hóa và kiểm thử với người có trải nghiệm thực tế. [W3C COGA — Making Content Usable](https://www.w3.org/TR/coga-usable/).

## 3.5 Rủi ro đặc thù của người thần kinh đa dạng và biện pháp giảm thiểu

| Rủi ro | Xác suất/Ảnh hưởng | Biện pháp giảm thiểu |
|---|---|---|
| "Một cỡ vừa cho tất cả" làm tăng quá tải | Cao/Cao | Cấu hình mặc định chỉ là điểm khởi đầu; điều khiển chi tiết; ghi nhớ sở thích cục bộ |
| Đơn giản hóa làm mất nghĩa | Trung/Cao | Bản gốc luôn ở cạnh kết quả; so sánh khác biệt/hoàn tác; cấm thay thế chỉ dẫn pháp lý/y tế |
| Tóm tắt bịa đặt quyết định (hallucinate) | Trung/Cao | Bắt buộc có mã bằng chứng (evidenceId); ưu tiên trích xuất; hiển thị "Không đủ bằng chứng" |
| Giao diện tự động thay đổi gây giật mình | Trung/Trung–Cao | Bật/tắt tự động cuộn; không có hộp thoại bất ngờ; giảm chuyển động; thông báo khi có thay đổi |
| Hệ thống bị dùng để giám sát nhân viên | Trung/Rất cao | Không chấm điểm sự chú ý/năng suất; tuyên bố về quyền riêng tư; không có bảng điều khiển cho nhà tuyển dụng trong MVP |
| Ngôn ngữ mang tính hạ thấp (infantilizing) | Trung/Cao | Ngôn ngữ đơn giản không đồng nghĩa với trẻ con; cho phép chọn mức độ chi tiết và xem bản gốc |

---

# 4. Phần giao nhau — một bài toán, hai lăng kính tiếp cận

## 4.1 Nhu cầu chung so với nhu cầu riêng

| Thành phần | DHH cần gì | Người thần kinh đa dạng có thể cần gì | Thành phần chung |
|---|---|---|---|
| Nội dung thời gian thực | Caption chính xác, người nói, âm thanh | Ít luồng cạnh tranh, giữ mạch | Nhật ký sự kiện bản ghi (transcript event log) |
| Mật độ thông tin | Đủ lời và tín hiệu để tương đương | Có thể cần giảm mật độ/hiện dần | Bộ hiển thị do người dùng kiểm soát |
| Khôi phục | Xem lại đoạn bỏ lỡ | Hiện tại/Trước đó/Tiếp theo | Chỉ mục mốc thời gian/bằng chứng |
| Chỉnh sửa | Sửa tên/thuật ngữ/lỗi ASR | Giảm sự mơ hồ và sửa lỗi nhận thức | Chú giải thuật ngữ + bộ nhớ chỉnh sửa |
| Thông báo | Tín hiệu thị giác cho sự kiện quan trọng | Gom nhóm/ẩn tín hiệu không quan trọng | Ngân sách ưu tiên/thông báo |
| Niềm tin | Biết máy không chắc ở đâu | Biết bản tóm tắt dựa trên câu nào | Độ tin cậy + nguồn gốc dữ liệu (provenance) |

### Sự đánh đổi (tension) phải thiết kế, không được che giấu

Người DHH có thể cần caption nguyên văn (verbatim) cùng tín hiệu người nói/âm thanh, trong khi một người dễ quá tải có thể muốn ít chữ và ít chuyển động. Giải pháp không phải chọn một bên, mà là:

```text
MỘT LỚP BẰNG CHỨNG DUY NHẤT
bản ghi nguyên văn + người nói + mốc thời gian + độ tin cậy
                         │
               chuyển đổi do người dùng kiểm soát
            ┌────────────┼────────────┐
            ↓            ↓            ↓
      Chế độ DHH    Chế độ Tập trung   Chế độ Kết hợp
    caption đầy đủ +   1–3 dòng +      bản ghi đầy đủ
   âm thanh/ngữ cảnh  không tự cuộn + tóm tắt theo yêu cầu
```

CapTune (ASSETS 2025) nghiên cứu caption tùy biến với 7 người tạo nội dung và 12 người tham gia DHH, cho thấy nhu cầu cân bằng giữa sự phong phú biểu đạt với tải nhận thức và ủng hộ việc để người xem kiểm soát trong giới hạn do người tạo nội dung định nghĩa. Đây là bằng chứng thiết kế hữu ích, không phải bằng chứng lâm sàng hoặc sự phù hợp sản phẩm-thị trường. [CapTune paper](https://soundability.eecs.umich.edu/img/portfolio/Huang_CapTune_ASSETS2025.pdf), [ACM DOI](https://doi.org/10.1145/3663547.3746346).

## 4.2 Tuyên bố vấn đề cốt lõi (North-star problem statement)

> **How might we help DHH and neurodivergent professionals follow, recover and act on fast-moving workplace conversations—without forcing everyone into the same display mode or surrendering trust to an opaque AI summary?**

Phiên bản tiếng Việt:

> Làm thế nào để người DHH và người thần kinh đa dạng theo dõi, khôi phục và hành động từ một cuộc trao đổi công việc diễn ra nhanh, mà không ép họ dùng cùng một cách hiển thị và không phải tin mù quáng vào bản tóm tắt AI?

## 4.3 Những điều tuyệt đối không làm (Anti-goals)

- Không "chữa trị", "bình thường hóa" hoặc chấm điểm người dùng.
- Không thay thế phiên dịch viên/dịch vụ CART khi mức độ chính xác hoặc ngữ cảnh yêu cầu con người.
- Không tuyên bố phù hợp cho tình huống khẩn cấp, y tế, pháp lý hoặc đánh giá hiệu suất công việc.
- Không ghi hình/phân tích nét mặt để suy ra cảm xúc/mức độ chú ý.
- Không đồng nhất ngôn ngữ ký hiệu Việt Nam (VSL) với ngôn ngữ ký hiệu Mỹ (ASL) hoặc caption chữ.

---

# 5. Ba concept PoC đã hội tụ

## 5.1 Bảng chọn nhanh

Điểm `/10` là ước lượng của nhóm nghiên cứu trong điều kiện đội 3 người/3 ngày. Trọng số ưu tiên độ ổn định và giá trị cho người dùng hơn số lượng model AI.

| Concept | Tính khả thi | Độ ấn tượng (WOW) | Phù hợp cả 2 nhóm | Độ ổn định | Tính khác biệt | AI có trách nhiệm | Tổng `/60` |
|---|---:|---:|---:|---:|---:|---:|---:|
| **A. SignalFlow Meeting Companion** | 8.0 | 9.0 | 10.0 | 8.0 | 9.0 | 9.0 | **53.0** |
| B. Adaptive Caption Studio | 9.0 | 8.0 | 8.5 | 9.0 | 8.5 | 9.0 | 52.0 |
| C. QuietSignal Notification Router | 8.5 | 7.5 | 8.0 | 8.5 | 8.0 | 9.0 | 49.5 |

**Khuyến nghị:** chọn A làm sản phẩm chủ lực; nếu ASR trực tiếp (streaming) không đạt độ trễ/độ ổn định sau mốc kiểm tra Ngày 1, chuyển hướng (pivot) sang B mà vẫn giữ lại gần như toàn bộ lớp giao diện/bằng chứng.

## 5.2 Concept A — SignalFlow Meeting Companion (khuyến nghị)

### Giá trị cốt lõi (Value proposition)

Biến hội thoại biến mất ngay thành một **dòng bằng chứng có thể theo dõi và khôi phục**, sau đó hiển thị khác nhau theo sở thích của từng người.

### Bộ tính năng MVP

1. Caption tiếng Việt trực tiếp với trạng thái tạm thời/cuối cùng (partial/final).
2. Chip người nói; cho phép gán/sửa người nói thủ công.
3. Tô sáng từ có độ tin cậy thấp + chỉnh sửa một chạm + chú giải thuật ngữ theo công việc.
4. "Tôi mất mạch" → Hiện tại/Trước đó/Tiếp theo, mỗi dòng mở được mốc thời gian.
5. Chế độ DHH / Tập trung / Kết hợp; phông chữ, mật độ, tự động cuộn, chuyển động và tín hiệu âm thanh tùy chỉnh.
6. Bản ghi gốc bất biến; chỉ xuất khi người dùng xác nhận.
7. Dự phòng ngoại tuyến bằng fixture/trích xuất.

### Kiến trúc toàn diện (Full-stack)

```text
┌──────────────────────────── CLIENT: Next.js/React PWA ────────────────────────────┐
│ getUserMedia + AudioWorklet │ điều khiển dễ tiếp cận │ bộ hiển thị DHH/Tập trung/Kết hợp │
└───────────────────────────────┬───────────────────────────────────────────────────┘
                                │ Khối dữ liệu PCM / WebSocket
┌───────────────────────────────▼───────────────────────────────────────────────────┐
│ Bộ điều phối thời gian thực FastAPI                                              │
│  VAD → ASR → mốc thời gian/độ tin cậy → gán người nói → sự kiện âm thanh (tùy chọn) │
└───────────────────────────────┬───────────────────────────────────────────────────┘
                                │ sự kiện chỉ thêm (append-only)
┌───────────────────────────────▼───────────────────────────────────────────────────┐
│ Lớp bằng chứng: SQLite/IndexedDB                                                 │
│ utteranceId, speakerId, thời điểm bắt đầu/kết thúc, văn bản nguyên văn, độ tin cậy, chỉnh sửa │
└───────────────────────────────┬───────────────────────────────────────────────────┘
              ┌─────────────────┴─────────────────┐
              ▼                                   ▼
  Pipeline xác định/trích xuất              LLM có căn cứ (tùy chọn)
  chú giải thuật ngữ, cửa sổ chủ đề, dự phòng   JSON nghiêm ngặt + mã bằng chứng
              └─────────────────┬─────────────────┘
                                ▼
                 Hiện tại / Trước đó / Tiếp theo + ứng viên hành động
                                ▼
                    người dùng xác minh → xuất (tùy chọn)
```

### Stack công nghệ khuyến nghị

- **Frontend:** Next.js/React, TypeScript, Tailwind/biến CSS; vùng ARIA live dùng thận trọng; ưu tiên bàn phím; service worker.
- **Thời gian thực:** Web Audio API/AudioWorklet, WebSocket; tránh mã hóa base64 nếu có thể.
- **Backend:** FastAPI, schema Pydantic, SQLite cho phiên demo.
- **ASR:** benchmark PhoASR-whisper-small và PhoWhisper-base/small trên cùng fixture; nếu máy/GPU không đủ, dùng đoạn ghi âm sẵn (prerecorded) hoặc ASR đám mây dự phòng có sự đồng ý. Không gọi model nào là "tốt nhất" trước khi đo trên miền dữ liệu thực.
- **VAD:** Silero VAD.
- **Người nói:** demo với đăng ký hai người nói/nút chuyển người nói thủ công trước khi thử pyannote.
- **Sự kiện âm thanh:** danh sách cho phép của YAMNet `[tiếng gõ cửa]`, `[chuông báo]`, `[vỗ tay]` nếu còn thời gian.
- **LLM:** dùng model có sẵn nhưng bắt buộc đầu ra có cấu trúc; nhiệt độ (temperature) thấp; chỉ dùng cửa sổ bản ghi; xác thực bằng chứng.
- **Lưu trữ/quyền riêng tư:** phiên cục bộ; âm thanh gốc mặc định không lưu; xóa phiên rõ ràng.

### Kịch bản demo gây ấn tượng (WOW) trong 3–5 phút

**0:00–0:30 — Rào cản.** Hai thành viên bắt đầu một cuộc họp tiếng Việt có tên dự án, hạn chót, một thuật ngữ chuyên môn và tiếng gõ cửa. Màn hình mặc định cố ý đông đúc, khán giả thấy thông tin biến mất nhanh.

**0:30–1:30 — Chế độ DHH.** Caption hiện người nói, mốc thời gian và `[tiếng gõ cửa]`. Một tên riêng có độ tin cậy thấp được tô sáng; người dùng sửa một lần, chú giải thuật ngữ cập nhật các lần xuất hiện liên quan.

**1:30–2:30 — Chế độ Tập trung.** Tắt tự động cuộn/chuyển động, ẩn tín hiệu không ưu tiên. Người dùng bấm **"Tôi mất mạch"**; Hiện tại/Trước đó/Tiếp theo xuất hiện, mỗi dòng mở đúng câu nguồn.

**2:30–3:30 — Một bằng chứng, nhiều chế độ xem.** Chuyển ngay giữa chế độ DHH/Tập trung/Kết hợp để chứng minh không tạo hai sản phẩm rời rạc. Người dùng xác nhận hạng mục hành động; hệ thống không tự động gửi gì cả.

**3:30–4:15 — AI có trách nhiệm.** Cố tình đưa ra một câu mơ hồ; hệ thống hiển thị "Chưa đủ bằng chứng để xác nhận hạn chót" thay vì bịa đặt. Tắt mạng; bản ghi/bản tóm tắt trích xuất vẫn hoạt động từ fixture/đường dẫn cục bộ.

**4:15–5:00 — Bằng chứng hiệu quả.** Hiện một bảng điều khiển nhỏ: độ trễ caption, độ chính xác thuật ngữ chính, độ phủ bằng chứng, thời gian khôi phục ngữ cảnh; kết bằng so sánh trước/sau của một công việc thực tế.

### Rủi ro và kế hoạch củng cố

| Chế độ lỗi | Phản ứng thiết kế |
|---|---|
| Model khởi động nguội | Nạp trước khi trình bày; chỉ báo trạng thái hoạt động; fixture làm nóng |
| Wi-Fi mất kết nối | ASR cục bộ hoặc fixture xác định trước ghi âm sẵn; không phụ thuộc một API duy nhất |
| Phân tách người nói bị trễ | Điều khiển thủ công/người nói đã biết là phương án dự phòng chính thức |
| LLM chậm | Caption không chờ LLM; Hiện tại/Trước đó/Tiếp theo dạng trích xuất xuất hiện trước |
| LLM bịa đặt (hallucinate) | Bộ xác thực schema/bằng chứng; từ chối trả lời; bản ghi gốc luôn mở được |
| Micro/tiếng vọng | Micro USB/gần miệng; kiểm tra quyền trước; công tắc đưa âm thanh ghi sẵn vào |

## 5.3 Concept B — Adaptive Caption Studio (Xưởng Caption Thích ứng)

**Giá trị:** một trình phát caption nơi người xem chọn kiểu nguyên văn/rút gọn, phông chữ/nền/vị trí, độ phong phú người nói/âm thanh và tốc độ hiển thị; người tạo nội dung cung cấp điểm neo (anchor), người dùng giữ quyền hiển thị.

```text
Video + track caption
 → trình chỉnh sửa bản ghi/cue + chỉnh sửa
 → token ngữ nghĩa caption {lời nói, người nói, âm thanh, không chắc chắn}
 → cấu hình hiển thị theo từng người xem
 → kiểm thử mức hiểu/sở thích
```

- **Giá trị cho DHH:** caption giàu ngữ cảnh, có chỉnh sửa và tùy biến.
- **Giá trị cho người thần kinh đa dạng:** kiểm soát mật độ, chuyển động, số dòng, hiển thị tăng dần.
- **WOW:** cùng một clip được hiển thị ba cách ngay lập tức; người dùng kéo thanh "độ phong phú ngữ cảnh" và "tải thị giác"; bằng chứng gốc không đổi.
- **Độ khó:** Thấp–Trung bình; rất ổn định vì không cần ASR trực tiếp.
- **Khoảng trống:** bớt "phép màu AI thời gian thực"; cần kể chuyện qua sự đánh đổi giữa độ phong phú và tải nhận thức, cùng quyền tự chủ của người dùng.
- **Nguồn gợi ý:** CapTune; demo EvolveCaptions về chỉnh sửa ASR mang tính cộng tác. [EvolveCaptions paper](https://soundability.eecs.umich.edu/img/portfolio/Wu_EvolveCaptions_ASSETS2025.pdf).

## 5.4 Concept C — QuietSignal Notification Router (Bộ định tuyến Thông báo)

**Giá trị:** hợp nhất các sự kiện giọng nói/âm thanh/trò chuyện thành thông báo có mức ưu tiên, cho người dùng chọn văn bản/hình ảnh/rung, gom nhóm, tạm ẩn và xác nhận.

```text
Sự kiện âm thanh từ micro + sự kiện cuộc họp + fixture chat giả lập
 → bộ chuẩn hóa sự kiện
 → quy tắc ưu tiên do người dùng thiết lập
 → hàng đợi hình ảnh/rung/im lặng
 → kiểm tra: vì sao cảnh báo này xuất hiện
```

- **Giá trị cho DHH:** nhận biết âm thanh có ý nghĩa và các lựa chọn thay thế bằng hình ảnh/rung.
- **Giá trị cho người thần kinh đa dạng:** giảm gián đoạn, gom nhóm cảnh báo ưu tiên thấp, xác nhận có thể dự đoán được.
- **WOW:** phát tiếng gõ cửa/chuông báo/chat; hai hồ sơ nhận kết quả khác nhau; người dùng điều chỉnh quy tắc ngay lập tức.
- **Độ khó:** Thấp–Trung bình.
- **Rào chắn an toàn:** công cụ hỗ trợ nhận biết, không phải bộ phát hiện khẩn cấp được chứng nhận; quy tắc do người dùng đặt ra, không phải AI tự suy ra "mức độ căng thẳng".

---

# 6. Thiết kế chi tiết SignalFlow

## 6.1 Hợp đồng dữ liệu (Data contract) — phần quan trọng nhất

```json
{
  "utteranceId": "u-014",
  "speakerId": "speaker-b",
  "startMs": 84210,
  "endMs": 88730,
  "verbatimText": "Minh sẽ gửi bản kiểm thử trước 4 giờ thứ Sáu.",
  "asrConfidence": 0.87,
  "status": "final",
  "corrections": [],
  "source": "microphone-local"
}
```

```json
{
  "now": {"text": "Đang chốt kế hoạch kiểm thử", "evidenceIds": ["u-013", "u-014"]},
  "before": {"text": "Nhóm chọn phương án B", "evidenceIds": ["u-009"]},
  "next": {"text": "Minh gửi bản kiểm thử trước 16:00 thứ Sáu", "evidenceIds": ["u-014"]},
  "confidence": "high",
  "needsConfirmation": true
}
```

Quy tắc xác thực:

```text
Nếu một trường có nội dung nhưng evidenceIds rỗng
→ không hiển thị như sự kiện thực (fact)
→ chuyển thành "Gợi ý của AI — chưa đủ bằng chứng" hoặc bỏ trường đó.
```

## 6.2 Đặc tả trải nghiệm người dùng (UX)

### Chế độ DHH

- 2–3 dòng caption; người nói hiển thị bằng tên + hình dạng (shape), không chỉ màu sắc.
- Âm thanh phi lời nói có ý nghĩa dùng kiểu hiển thị riêng, chỉ từ danh sách cho phép.
- Độ tin cậy thấp dùng gạch chân/biểu tượng, không nhấp nháy.
- Chỉnh sửa bằng bàn phím; chú giải từ tùy chỉnh có xem trước.
- Bản ghi/tìm kiếm mở theo yêu cầu; không tự động thu gọn bằng chứng.

### Chế độ Tập trung

- Một cột, giảm chuyển động, tùy chọn không tự động cuộn.
- Chỉ hiện chủ đề hiện tại + một ứng viên hành động.
- Thông báo mức thấp được gom nhóm; thay đổi có văn bản rõ ràng, không chỉ dựa vào màu sắc/hiệu ứng động.
- "Tôi mất mạch" luôn ở cùng vị trí và có phím tắt.
- Bản ghi gốc cách tối đa một thao tác.

### Chế độ Kết hợp

- Caption nguyên văn ở trung tâm.
- Bản tóm tắt thu gọn bên cạnh/bên dưới; không cạnh tranh với caption.
- Tín hiệu âm thanh và chat chỉ hiện khi đạt ngưỡng ưu tiên cho phép.

## 6.3 Tiêu chí chấp nhận về khả năng tiếp cận

- Toàn bộ luồng chính (hero flow) dùng được bằng bàn phím; điểm lấy nét (focus) rõ ràng và thứ tự ổn định.
- Không truyền thông tin chỉ bằng màu sắc; người nói có văn bản/hình dạng.
- Phóng to 200%, đáp ứng (responsive), không mất hành động hoặc bản ghi.
- Tôn trọng chế độ giảm chuyển động; không tự động cuộn nếu người dùng tắt.
- Độ tương phản/kích thước/số dòng của caption có thể điều khiển.
- Vùng live không đọc lặp caption tạm thời liên tục; chỉ thông báo sự kiện cuối cùng/ưu tiên theo sở thích.
- Văn bản gốc, lịch sử chỉnh sửa và lớp AI được phân biệt rõ ràng.
- Xóa phiên/xuất dữ liệu/đồng ý dễ tìm và mô tả bằng ngôn ngữ đơn giản.

## 6.4 Đảm bảo an toàn AI

| Lớp | AI được phép làm | AI không được phép làm |
|---|---|---|
| ASR | Phiên âm, độ tin cậy, các phương án ứng viên | Che giấu mức độ không chắc chắn hoặc tự sửa bằng chứng mà không ghi log |
| Người nói/âm thanh | Ứng viên nhãn người nói/âm thanh | Nhận diện danh tính trái phép; suy luận cảm xúc |
| Tóm tắt | Trích xuất/diễn đạt ngắn từ cửa sổ bằng chứng | Bịa đặt quyết định, hạn chót, ý định hoặc chẩn đoán |
| Cá nhân hóa | Áp dụng cài đặt người dùng đã chọn | Suy luận khuyết tật/hồ sơ từ hành vi |
| Hành động | Đề xuất ứng viên để xác nhận | Tự động gửi email/tạo task hoặc hồ sơ đánh giá hiệu suất |

Áp dụng tư duy của NIST: quản trị, ánh xạ, đo lường, quản lý (govern, map, measure, manage); xác định tác hại, đo lường trên ngữ cảnh sử dụng và cung cấp cách xử lý lỗi thay vì chỉ tối ưu hóa điểm số benchmark. [NIST AI 600-1 — Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf).

---

# 7. Dữ liệu, model, giấy phép và quyết định xây dựng/mua sẵn

| Tài nguyên | Dùng để làm gì | Quyền truy cập/giấy phép theo nguồn | Quyết định |
|---|---|---|---|
| PhoASR-whisper-small | ASR tiếng Việt | BSD-3-Clause-Clear + Qualcomm Responsible AI License; mục đích sử dụng cho nghiên cứu/giáo dục | **Ứng viên benchmark chính; kiểm tra điều khoản trước khi nộp bài/triển khai** |
| PhoWhisper | ASR tiếng Việt | BSD-3-Clause theo thẻ model | Phương án tích hợp nhanh dự phòng |
| VietASR | ASR tiếng Việt nâng cao | Kho lưu trữ giấy phép Apache-2.0; checkpoint công khai | Mở rộng/benchmark, không phải đường găng |
| Whisper/faster-whisper | Baseline đa ngôn ngữ/công cụ suy luận | Whisper giấy phép MIT; kiểm tra wrapper/model cụ thể | Dự phòng và công cụ hỗ trợ |
| Common Voice | Benchmark giọng nói đa dạng | Kiểm tra bảng dữ liệu (datasheet)/bản phát hành của tập con đã tải | Đánh giá, không tinh chỉnh (fine-tune) trong 3 ngày |
| AMI Meeting Corpus | Kiểm thử pipeline người nói/cuộc họp | Corpus cung cấp bản ghi/chú thích; kiểm tra lại từng thành phần | Benchmark kỹ thuật bằng tiếng Anh |
| QMSum | Tóm tắt cuộc họp theo truy vấn | Bài báo/dataset gốc | Nguyên mẫu đánh giá, không đại diện cho tiếng Việt |
| YAMNet | Ứng viên âm thanh có ý nghĩa | Model/hướng dẫn của TensorFlow Hub | Chỉ dùng danh sách cho phép (tùy chọn) |
| VSL400 | Nghiên cứu VSL từ đơn lẻ | Quyền truy cập có kiểm soát/Thỏa thuận Sử dụng Dữ liệu | Việc trong tương lai, không phải MVP |

Nguồn: [OpenAI Whisper](https://github.com/openai/whisper), [AMI Corpus](https://groups.inf.ed.ac.uk/ami/corpus/), [QMSum paper](https://aclanthology.org/2021.naacl-main.472/), [Mozilla Common Voice](https://commonvoice.mozilla.org/en/datasets).

### Cổng benchmark trước khi khóa model

Tạo một bộ kiểm thử (test pack) 8–10 phút, không cần huấn luyện:

- 2 người nói tiếng Việt; 2 giọng vùng miền nếu có.
- 20 từ khóa: tên người, tên dự án, từ viết tắt, hạn chót.
- 3 điều kiện: yên tĩnh, tiếng ồn văn phòng nền, chồng chéo ngắn.
- Bản ghi chuẩn (gold transcript) do người kiểm tra thủ công.

Đo lường:

- WER/CER để tham khảo.
- **Độ chính xác thuật ngữ chính** — quan trọng hơn WER tổng thể đối với demo.
- Độ trễ hoàn thiện caption trung vị/phân vị thứ 95 (p95).
- Tỷ lệ gán đúng người nói trong đoạn không chồng chéo.
- Thời gian chỉnh sửa cho một tên bị sai.

Model chỉ được chọn sau khi benchmark trên đúng laptop sẽ dùng để demo. Tuyên bố từ bài báo/thẻ model không thay thế phép đo này.

---

# 8. Kế hoạch đánh giá — chứng minh tác động trong hackathon

## 8.1 Chỉ số chính

| Kết quả | Chỉ số | Mục tiêu cho PoC | Cách đo |
|---|---|---:|---|
| Tiếp nhận từ khóa | Độ chính xác thuật ngữ chính | ≥ 90% trên fixture kịch bản trong môi trường yên tĩnh | Danh sách chuẩn 20 thuật ngữ |
| Tốc độ caption | Độ trễ hoàn thiện trung vị | ≤ 2,0 giây | mốc thời gian âm thanh → tín hiệu hoàn thiện |
| Khôi phục mạch | Thời gian khôi phục ngữ cảnh | Giảm ≥ 30% so với việc dò tìm trong bản ghi | 3 câu hỏi Hiện tại/Trước đó/Tiếp theo |
| Niềm tin | Độ phủ bằng chứng | 100% các trường sự kiện thực trong bản tóm tắt có mã bằng chứng | kiểm tra tự động theo schema |
| Sửa lỗi | Hoàn tất chỉnh sửa | ≤ 2 thao tác chính | quan sát tính khả dụng (usability) |
| Độ ổn định | Số lần chạy liền mạch liên tiếp | 3/3 | tổng duyệt cùng máy/micro/kế hoạch mạng |

Các mục tiêu trên là **ngưỡng chấp nhận do đội đề xuất**, chưa phải chuẩn ngành.

## 8.2 Nghiên cứu nhỏ khả thi

Nếu có 2–5 người tham gia đồng thiết kế/kiểm thử, dùng một nhiệm vụ ngắn theo thiết kế trong-đối-tượng (within-subject):

1. Xem đoạn cuộc họp 90 giây ở bản ghi cơ sở (baseline).
2. Trả lời: chủ đề hiện tại, quyết định trước đó, người phụ trách/hạn chót.
3. Lặp lại với SignalFlow trên một clip khác có độ khó tương đương.
4. Ghi lại độ chính xác, thời gian khôi phục, số lần phải dò tìm, tải nhận thức cảm nhận (1–5) và sở thích.
5. Phỏng vấn: thông tin nào thừa, tín hiệu nào gây khó chịu, cài đặt nào muốn giữ lại.

Không gộp kết quả của người tham gia DHH và người thần kinh đa dạng thành một mức trung bình duy nhất nếu nhu cầu trái chiều. Báo cáo theo từng hồ sơ/nhiệm vụ riêng và ghi rõ cỡ mẫu rất nhỏ.

## 8.3 Câu hỏi đồng thiết kế nên hỏi

### Với cộng tác viên DHH

- Khi caption sai, loại lỗi nào gây hậu quả lớn nhất?
- Nhãn người nói, tín hiệu âm thanh và độ tin cậy nên xuất hiện thế nào?
- Caption nguyên văn hay đã chỉnh sửa/rút gọn hữu ích trong bối cảnh nào?
- Khi nào cần phiên dịch viên/dịch vụ CART thay vì sản phẩm này?

### Với cộng tác viên thần kinh đa dạng

- Thành phần nào trong cuộc họp gây quá tải: âm thanh, khuôn mặt, chat, chuyển động, mật độ hay sự mơ hồ?
- "Mất mạch" được nhận biết và khôi phục như thế nào hiện nay?
- Tự động cuộn, thông báo và tóm tắt nên bật theo cách nào?
- Ngôn ngữ đơn giản hữu ích ở đâu, gây khó chịu/mất nghĩa ở đâu?

### Với người thuộc cả hai nhóm

- Sự đánh đổi giữa caption đầy đủ và quá tải xảy ra lúc nào?
- Cấu hình mặc định nào thực sự giúp ích; việc chuyển chế độ giữa cuộc họp có gây thêm tải không?
- Điều gì khiến họ tin hoặc không tin vào bản tóm tắt AI?

---

# 9. Kế hoạch 3 ngày và tiêu chí dừng (kill criteria)

## Trước hackathon

- Nạp sẵn model và các thư viện phụ thuộc; kiểm kê giấy phép.
- Chuẩn bị fixture âm thanh chuẩn + bản ghi + 20 từ khóa.
- Khung sườn PWA, token thiết kế dễ tiếp cận, luồng sự kiện bản ghi giả lập.
- Viết hướng dẫn phỏng vấn; mời tối thiểu 1 người DHH và 1 người thần kinh đa dạng làm người phản biện nếu có thể.

## Ngày 1 — Tìm hiểu & Định hình

| Thời điểm | Việc phải hoàn tất | Cổng kiểm tra |
|---|---|---|
| Sáng | Thu thập ý kiến người dùng cuối; tuyên bố vấn đề; 1 hành trình chính | Điểm đau được xác nhận hoặc điều chỉnh |
| Trưa | Benchmark PhoWhisper/phương án dự phòng trên laptop | Chọn ASR dựa trên độ trễ/độ chính xác thuật ngữ chính |
| Chiều | Schema bằng chứng + luồng sự kiện giả lập/thực + 2 chế độ xem | Giao diện chạy được ngay cả khi AI chưa sẵn sàng |
| Cuối ngày | Kiểm thử streaming 3 lần | Nếu không ổn, chuyển sang ghi âm sẵn/Adaptive Caption Studio |

## Ngày 2 — Xây dựng & Kiểm thử

- Hoàn thiện caption/chỉnh sửa/chú giải thuật ngữ.
- Triển khai Hiện tại/Trước đó/Tiếp theo dạng xác định/trích xuất.
- Chỉ thêm LLM sau khi việc xác thực bằng chứng đã đạt yêu cầu.
- Kiểm thử bàn phím/giảm chuyển động/vùng live.
- Vòng phản hồi người dùng đầu tiên; cắt bỏ tính năng không giải quyết luồng chính.

## Ngày 3 — Củng cố & Thuyết trình

- Kiểm tra chịu lỗi: tắt mạng, từ lạ, sai người nói, câu hạn chót mơ hồ.
- Tổng duyệt 3 lần chạy liền mạch; quay video dự phòng dưới 5 phút.
- Slide chỉ giữ: người/nhiệm vụ → rào cản → bằng chứng → giải pháp → demo → chỉ số → AI có trách nhiệm → lộ trình mở rộng.
- Bài thuyết trình nói rõ giới hạn; không tuyên bố đại diện cộng đồng nếu chưa đồng thiết kế đủ.

## Tiêu chí dừng (Kill criteria)

- **Bỏ phân tách người nói trực tiếp** nếu độ trễ/lỗi khiến caption khó đọc sau 2 giờ điều chỉnh.
- **Bỏ YAMNet** nếu cảnh báo giả xuất hiện quá 1 lần trong demo có kịch bản.
- **Bỏ tóm tắt sinh tạo (generative)** nếu bất kỳ trường sự kiện thực nào không giữ được liên kết bằng chứng; dùng bản tóm tắt trích xuất thay thế.
- **Chuyển sang Concept B** nếu ASR trực tiếp không đạt 3 lần chạy liền mạch vào cuối Ngày 1.
- Không bao giờ bỏ bản ghi/bằng chứng/dự phòng để giữ một hiệu ứng AI hào nhoáng.

## Phân vai đội 3 người

| Vai trò | Trách nhiệm chính |
|---|---|
| Trưởng nhóm Sản phẩm/Khả năng tiếp cận | Đồng thiết kế, phạm vi, nội dung UX, kiểm tra bàn phím/khả năng tiếp cận, thuyết trình/đánh giá |
| Trưởng nhóm Frontend/thời gian thực | Thu âm, PWA, các cấu hình hiển thị, trạng thái/dự phòng, đo lường |
| Trưởng nhóm AI/backend | ASR/VAD, dịch vụ bằng chứng, bộ xác thực tóm tắt, benchmark/quyền riêng tư |

---

# 10. Chiến lược thuyết trình theo tiêu chí ADC

| Tiêu chí | Điều BGK cần thấy | Bằng chứng trên sân khấu |
|---|---|---|
| Đổi mới & Tác động | Không phải bản sao caption; giải quyết sự tham gia + khôi phục | Một dòng bằng chứng, nhiều chế độ xem, chỉnh sửa và tóm tắt gắn bằng chứng |
| Thiết kế lấy người dùng làm trung tâm & Khả năng tiếp cận | Nhu cầu khác nhau không bị ép chung | Chuyển đổi trực tiếp giữa DHH/Tập trung; cài đặt do người dùng chọn; trích dẫn/lặp lại từ đồng thiết kế |
| Tính khả thi & Thực tiễn | MVP chạy trên laptop/trình duyệt thông thường | Cục bộ/dự phòng, phạm vi 3 ngày, chỉ số độ trễ/độ ổn định |
| Ứng dụng AI | AI có vai trò cần thiết và có trách nhiệm | ASR + tóm tắt có cấu trúc; độ tin cậy/bằng chứng/từ chối trả lời |
| Trình bày & Truyền đạt | Một câu chuyện rõ ràng, không phải liệt kê tính năng | Rào cản → hành động người dùng → khôi phục → kết quả đo lường được |

### Định vị 30 giây

> Workplace conversations disappear the moment they are spoken. For Deaf and hard-of-hearing professionals, the missing layer may be accurate captions, speakers and sound context. For neurodivergent professionals, it may be the ability to filter overload and recover the thread after an interruption. SignalFlow creates one trustworthy evidence timeline and lets each person choose how to receive it—full captions, a low-stimulation view, or an evidence-linked Now/Before/Next recap. AI assists, but it never overwrites the original conversation or acts without confirmation.

Bản dịch tiếng Việt:

> Các cuộc trò chuyện tại nơi làm việc biến mất ngay khi vừa được nói ra. Với người Điếc và khiếm thính, phần còn thiếu có thể là caption chính xác, thông tin người nói và ngữ cảnh âm thanh. Với người thần kinh đa dạng, đó có thể là khả năng lọc bỏ quá tải và khôi phục mạch chuyện sau khi bị gián đoạn. SignalFlow tạo ra một dòng bằng chứng đáng tin cậy duy nhất và để mỗi người tự chọn cách tiếp nhận nó — caption đầy đủ, một chế độ xem ít kích thích, hoặc bản tóm tắt Hiện tại/Trước đó/Tiếp theo gắn liền với bằng chứng. AI chỉ hỗ trợ, không bao giờ ghi đè cuộc trò chuyện gốc hay hành động mà chưa được xác nhận.

### Câu hỏi khó dự kiến

**"Teams/Meet đã có caption và ghi chú AI; khác biệt ở đâu?"**
Cơ sở hiện tại biến giọng nói thành chữ và tóm tắt cho số đông. SignalFlow đặt quyền tự chủ về khả năng tiếp cận ở trung tâm: chỉnh sửa/độ không chắc chắn, tải nhận thức do người xem kiểm soát, khôi phục ngữ cảnh có mốc thời gian và phương án dự phòng không bịa đặt.

**"Tại sao hai lĩnh vực này lại chung một sản phẩm?"**
Chung một pipeline bằng chứng nhưng khác bộ hiển thị (renderer). Đội không nói nhu cầu giống nhau; đội thiết kế một hạ tầng thông tin có thể thích ứng mà không phân tách người dùng.

**"Tại sao không làm ngôn ngữ ký hiệu?"**
VSL là một ngôn ngữ đầy đủ và bài toán dịch thuật cần dữ liệu/đồng thiết kế ở quy mô lớn. VSL400 hiện là dữ liệu từ đơn lẻ, quyền truy cập có kiểm soát. Hứa hẹn dịch thuật tổng quát trong 3 ngày sẽ thiếu trung thực và khó ổn định.

**"Nếu bản tóm tắt AI sai thì sao?"**
Mọi trường sự kiện thực đều cần mã bằng chứng; không có bằng chứng thì hệ thống từ chối trả lời. Caption/bản ghi không chờ đợi và không bị LLM sửa đổi; người dùng xác nhận hành động.

**"Có đang giám sát nhân viên không?"**
Không có chấm điểm cảm xúc/chú ý/năng suất, không có bảng điều khiển cho nhà tuyển dụng. Mặc định cục bộ/tạm thời, có sự đồng ý rõ ràng, xuất/xóa dữ liệu do người dùng kiểm soát.

---

# 11. Lộ trình sau hackathon

| Giai đoạn | Mục tiêu | Điều kiện trước khi mở rộng |
|---|---|---|
| PoC | Cuộc họp tiếng Việt 2 người nói, 2 chế độ xem, tóm tắt có bằng chứng | Kiểm tra nhanh về độ ổn định + khả năng tiếp cận |
| Thí điểm (Pilot) | Ứng dụng đồng hành cho Zoom/Teams hoặc ứng dụng web phòng họp; chú giải thuật ngữ theo tổ chức | Rà soát pháp lý/đồng ý; đồng thiết kế với người DHH + thần kinh đa dạng |
| Bản beta sản phẩm | Hồ sơ cá nhân, caption đa ngôn ngữ, triển khai không cần quản trị viên | Bảo mật, thời gian lưu trữ, giám sát model, hỗ trợ con người |
| Mở rộng quy mô | SDK/API cho học tập, hội nhập và cuộc gọi hỗ trợ | Mua sắm, tuân thủ, đánh giá kết quả |

Hướng đi kinh doanh hợp lý là **lớp hỗ trợ B2B2E (doanh nghiệp-tới-nhân viên)** hoặc SDK cho các nền tảng làm việc/học tập. Tuy nhiên, cần tránh mô hình bán phân tích giám sát (surveillance analytics) cho nhà tuyển dụng; giá trị cốt lõi nên là sự tham gia của nhân viên, chất lượng cuộc họp và kiến thức dễ tiếp cận — không phải chẩn đoán hay chấm điểm năng suất.

---

# 12. Sổ đăng ký rủi ro tổng hợp

| Mã | Rủi ro | Mức nghiêm trọng | Tín hiệu sớm | Phản ứng của người phụ trách |
|---|---|---:|---|---|
| R1 | Caption tiếng Việt không ổn định | Cao | Độ chính xác thuật ngữ chính <90%, độ trễ >2s | Benchmark/chuyển hướng/dự phòng/chú giải thuật ngữ |
| R2 | Hai hướng nghiên cứu trông như ghép cơ học | Cao | Demo phải mở hai ứng dụng/luồng riêng | Một schema bằng chứng duy nhất, chuyển đổi hiển thị trực tiếp |
| R3 | Tính năng cho người thần kinh đa dạng trở thành "công cụ năng suất" | Cao | Bài thuyết trình nói về hiệu suất nhiều hơn khả năng tiếp cận | Đặt trọng tâm vào sự tham gia/khôi phục, bằng chứng từ đồng thiết kế |
| R4 | LLM bịa đặt (hallucination) | Cao | Trường tóm tắt thiếu nguồn | Bộ xác thực + từ chối trả lời + dự phòng bằng trích xuất |
| R5 | Quyền riêng tư/sự đồng ý | Cao | Âm thanh gốc/đám mây theo mặc định | Ưu tiên cục bộ, chỉ báo rõ ràng, lưu trữ/xóa dữ liệu rõ ràng |
| R6 | Quá tải do caption/hiệu ứng | Trung bình–Cao | Người dùng tắt ứng dụng/khó theo dõi | Điều khiển mật độ/chuyển động/ưu tiên |
| R7 | Kiểm chứng mang tính hình thức (tokenistic) | Cao | Chỉ có persona giả định | Phiên làm việc với người dùng thực; công bố rõ giới hạn |
| R8 | Dữ liệu/giấy phép bị chặn | Trung bình | Quyền truy cập chưa được phê duyệt | Không dùng dataset có kiểm soát trên đường găng |
| R9 | Sự cố phần cứng/mạng khi demo | Cao | Không đạt 3 lần chạy liền mạch | Nạp trước, fixture cục bộ, video dự phòng |

---

# 13. Kết luận và quyết định cuối cùng

**DHH + Người thần kinh đa dạng là một cặp mạnh cho ADC 2026** khi đội không cố tạo "một giải pháp cho hai loại khuyết tật", mà xây một hạ tầng giao tiếp cho phép mỗi người kiểm soát phương thức hiển thị, mật độ thông tin và khả năng khôi phục.

Quyết định đề xuất:

1. Chọn **tính liên tục của cuộc họp tại nơi làm việc** làm không gian vấn đề.
2. Xây dựng **SignalFlow** với một dòng bằng chứng bất biến và ba chế độ hiển thị.
3. Đặt caption/chỉnh sửa/Hiện tại-Trước đó-Tiếp theo/dự phòng trong MVP; phân tách người nói, sự kiện âm thanh và LLM là lớp tăng cường có tiêu chí dừng riêng.
4. Benchmark tiếng Việt trên laptop thật trước khi khóa PhoWhisper/VietASR/phương án dự phòng đám mây.
5. Đồng thiết kế riêng với người dùng DHH và thần kinh đa dạng; nếu có người tham gia thuộc cả hai nhóm, ưu tiên kiểm tra sự đánh đổi giữa độ phong phú của caption và tải nhận thức.
6. Đo lường kết quả về sự tham gia: độ tiếp nhận thuật ngữ chính, thời gian khôi phục, độ phủ bằng chứng và độ ổn định của các lần chạy liền mạch.

Nếu phải cắt giảm đến mức tối thiểu, hãy giữ đúng khoảnh khắc này:

> Một cuộc họp đang diễn ra. Người dùng chuyển sang chế độ phù hợp với mình, sửa một caption quan trọng, bấm "Tôi mất mạch", nhận được ba dòng có mốc thời gian, và thấy hệ thống từ chối bịa đặt một hạn chót chưa được nói rõ.

Đó là một demo vừa trực quan, có chiều sâu về khả năng tiếp cận, có AI thực sự cần thiết, và đủ trung thực để phát triển thành sản phẩm.

---

# Phụ lục A — Bản đồ nguồn trọng yếu

## Nghiên cứu về cuộc thi / tiêu chuẩn / trải nghiệm thực tế

- [ADC Hackathon 2026 — RMIT Vietnam](https://industryhub.rmit.edu.vn/ADC/)
- [W3C — Collaboration Tools Accessibility User Requirements](https://www.w3.org/TR/ctaur/)
- [W3C — Media Accessibility User Requirements](https://www.w3.org/TR/media-accessibility-reqs/)
- [W3C — Cognitive Accessibility](https://www.w3.org/WAI/cognitive/)
- [W3C — Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/)
- [W3C — Auditory disabilities](https://www.w3.org/WAI/people-use-web/abilities-barriers/auditory/)
- [W3C — Captions](https://www.w3.org/WAI/media/av/captions/)
- [Microsoft Research — Managing Stress: The Needs of Autistic Adults in Video Calling](https://www.microsoft.com/en-us/research/publication/managing-stress-the-needs-of-autistic-adults-in-video-calling/)
- [Alharbi et al. — Accessibility Barriers, Conflicts, and Repairs in Hybrid Meetings](https://doi.org/10.1145/3544548.3581541)
- [Kan et al. — Workplace needs of autistic adults in Singapore, 2026](https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2026.1825357/full)
- [Jiang et al. — Video accessibility strategies for people with ADHD, CHI 2025](https://lucyajiang.github.io/files/papers/CHI25-ADHDVideo.pdf)
- [CapTune — ASSETS 2025](https://soundability.eecs.umich.edu/img/portfolio/Huang_CapTune_ASSETS2025.pdf)
- [EvolveCaptions — ASSETS 2025](https://soundability.eecs.umich.edu/img/portfolio/Wu_EvolveCaptions_ASSETS2025.pdf)
- [WHO — Autism](https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders)

## Model / dữ liệu / triển khai kỹ thuật

- [PhoASR-whisper-small model card](https://huggingface.co/Qualcomm-AI-Research/PhoASR-whisper-small)
- [Vietnamese Automatic Speech Recognition: A Revisit — EACL 2026](https://aclanthology.org/2026.findings-eacl.345/)
- [PhoWhisper model card](https://huggingface.co/vinai/PhoWhisper-base/blob/main/README.md)
- [VietASR official repository](https://github.com/zzasdf/VietASR)
- [OpenAI Whisper](https://github.com/openai/whisper)
- [Mozilla Common Voice](https://commonvoice.mozilla.org/en/datasets)
- [AMI Meeting Corpus](https://groups.inf.ed.ac.uk/ami/corpus/)
- [QMSum](https://aclanthology.org/2021.naacl-main.472/)
- [YAMNet](https://www.tensorflow.org/hub/tutorials/yamnet)
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/)
- [VSL400 record](https://zenodo.org/records/17943574)
- [NIST AI 600-1 — Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)

# Phụ lục B — Mức độ tin cậy và khoảng trống chưa giải quyết

| Nhóm tuyên bố | Bằng chứng | Độ tin cậy | Khoảng trống còn lại |
|---|---|---:|---|
| Định dạng/tiêu chí ADC | Trang chính thức của RMIT | Cao | Brief chi tiết chỉ được công bố vào Ngày 1 |
| Rào cản cộng tác/nhận thức | W3C + nghiên cứu định tính đã bình duyệt | Cao | Cần xác nhận trong bối cảnh Việt Nam |
| Tùy biến caption | W3C + CapTune | Trung bình–Cao | Mẫu nghiên cứu nhỏ; không suy rộng cho mọi người dùng |
| Ứng viên ASR tiếng Việt | Thẻ model/kho lưu trữ/bài báo | Trung bình–Cao | Bộ dữ liệu 500 giờ trong bài báo và bộ huấn luyện model 3000 giờ có nguồn gốc (lineage) khác nhau; không gộp hai tuyên bố này; phải benchmark trên phần cứng/tiếng ồn/giọng vùng miền thực tế |
| Phạm vi VSL | Scientific Data/Zenodo | Cao | Quyền truy cập có kiểm soát; chưa đánh giá dịch thuật trực tiếp |
| Điểm số/mục tiêu sản phẩm | Đánh giá chủ quan của nhóm phân tích | Trung bình | Phụ thuộc vào kỹ năng/GPU/API/năng lực đồng thiết kế của đội |
| Sự khác biệt trên thị trường | So sánh ở cấp độ tính năng | Trung bình | Chưa thực hiện nghiên cứu về bằng sáng chế/định giá/mua sắm |

**Nghiên cứu chưa giải quyết cần hoàn tất tại hackathon:** nhu cầu ưu tiên của người dùng địa phương; sở thích giữa VSL/chữ; cách hiển thị độ tin cậy mà không gây quá tải; kỳ vọng về quyền riêng tư của doanh nghiệp; hiệu năng của ASR trên giọng nói/giọng vùng miền và micro thực tế.
