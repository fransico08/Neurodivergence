# Deep Research Focus Report — Deaf or Hard of Hearing + Neurodivergence

**ADC Hackathon 2026 | Bản nghiên cứu chuyên sâu phục vụ quyết định sản phẩm và PoC**  
**Ngày khóa nghiên cứu:** 08/09/2026  
**Bối cảnh:** hackathon trực tiếp 3 ngày, video/pitch dưới 5 phút, trọng tâm AI & Employability tại Việt Nam.

> **Kết luận một câu:** Đừng làm thêm một ứng dụng “speech-to-text” hay một trợ lý productivity chung chung. Hãy xây **SignalFlow — một evidence timeline của cuộc họp với nhiều chế độ hiển thị do người dùng kiểm soát**, giúp người Deaf/Hard of Hearing tiếp nhận đúng nội dung và giúp người neurodivergent giữ hoặc khôi phục mạch hội thoại mà không bị quá tải.

---

## 0. Executive Decision Brief

### Lựa chọn chiến lược

**Hai lĩnh vực:** Deaf or Hard of Hearing (DHH) + Neurodivergence.  
**Job-to-be-done chung:** tham gia bình đẳng vào cuộc họp, đào tạo và cộng tác tại nơi làm việc khi thông tin đến quá nhanh, sai modality, thiếu ngữ cảnh hoặc phân tán trên quá nhiều điểm chú ý.  
**Hero product:** **SignalFlow — “One conversation, many accessible views.”**  
**Mức khả thi ước lượng:** 8/10 nếu đóng scope đúng; 5/10 nếu cố làm continuous sign-language translation, emotion detection hoặc diarization hoàn hảo.

Lựa chọn này khớp trực tiếp với đề bài ADC 2026: hackathon diễn ra **21–23/09/2026**, chủ đề **AI & Employability**, yêu cầu đội 3 người và chấm theo Innovation & Impact, User-Centred Design & Accessibility, Feasibility & Practicality, Use of AI, cùng Presentation & Communication ở vòng cuối. [ADC Hackathon 2026 — RMIT Vietnam](https://industryhub.rmit.edu.vn/ADC/).

### Vì sao hai lĩnh vực này kết hợp tự nhiên

Hai cộng đồng không có cùng nhu cầu, và cũng không nên bị gom thành một persona. Tuy nhiên, trong meeting/hybrid work, họ thường gặp cùng một **điểm gãy thông tin**:

```text
Âm thanh trực tiếp, nhanh, chồng lấn, biến mất ngay
                  │
        ┌─────────┴─────────┐
        │                   │
 DHH: không nghe đủ      Neurodivergence: khó lọc,
 hoặc không rõ ai nói    chuyển chú ý, giữ working memory
        │                   │
        └─────────┬─────────┘
                  ↓
 Cần một evidence timeline có speaker, timestamp, correction
                  ↓
   DHH View / Focus View / Combined View theo lựa chọn cá nhân
```

W3C lưu ý caption đồng bộ vẫn có thể tạo rào cản cho một số người có khó khăn đọc/xử lý vì người xem phải chia chú ý giữa video và chữ; transcript đầy đủ hỗ trợ xem lại và đọc theo tốc độ riêng nhưng **không thay thế** caption thời gian thực. W3C cũng chỉ ra công cụ cộng tác có thể trở nên quá tải về nhận thức khi teleconference, nhiều người không thể theo dõi nhiều vị trí cập nhật cùng lúc, và WCAG compliance riêng lẻ chưa đủ giải quyết toàn bộ vấn đề cộng tác. [Media Accessibility User Requirements](https://www.w3.org/TR/media-accessibility-reqs/), [Collaboration Tools Accessibility User Requirements](https://www.w3.org/TR/ctaur/).

### Phạm vi phải giữ

| MUST trong PoC | SHOULD nếu pipeline ổn | WON’T trong 3 ngày |
|---|---|---|
| Streaming caption tiếng Việt; transcript bất biến; timestamp; correction; glossary; “I lost the thread”; 2 chế độ hiển thị; fallback offline | Speaker attribution đơn giản; meaningful sound labels; LLM recap có evidence; xử lý local-first | Chẩn đoán ADHD/autism; emotion/attention scoring; continuous VSL translation; certified emergency alerts; tự động tạo task/email không xác nhận |

### Quy tắc sản phẩm

1. **Rules first, AI second, user has the last word.**
2. Transcript gốc là evidence; summary không được âm thầm ghi đè nó.
3. Mỗi phát biểu suy diễn phải dẫn về `evidenceId`/timestamp hoặc hiển thị “Không chắc”.
4. Không suy luận disability, cảm xúc, mức chú ý hay productivity từ giọng nói, camera hoặc clickstream.
5. Personalization là quyền chọn của người dùng, không phải profile do hệ thống gắn nhãn.

---

# 1. Khung nghiên cứu và mức tin cậy

## 1.1 Câu hỏi quyết định

1. Trong workplace communication, đâu là pain point đủ chung để dùng chung tech stack nhưng vẫn giải quyết đúng nhu cầu riêng của DHH và neurodivergent users?
2. Baseline thị trường đã làm được gì, và khoảng trống nào còn đủ mới để thuyết phục BGK?
3. AI nào mang lại giá trị quan sát được trong 3–5 phút mà không biến demo thành canh bạc latency/hallucination?
4. Dữ liệu/model tiếng Việt nào có thể dùng hợp pháp và triển khai trong thời gian hackathon?
5. Chỉ số nào chứng minh accessibility tốt hơn thay vì chỉ “trông thông minh”?

## 1.2 Phương pháp và giới hạn

- Ưu tiên nguồn chính thống: RMIT/ADC, W3C, WHO, model card/repository chính thức, paper gốc và trang dataset chính thức.
- Tách rõ **bằng chứng nguồn** khỏi **khuyến nghị phân tích**. Điểm số, latency budget và scope là judgment cho một đội 3 người, không phải kết quả clinical trial.
- Nghiên cứu quốc tế được dùng để định hình barrier và architecture; chưa thay thế phỏng vấn người dùng DHH/neurodivergent tại Việt Nam.
- “Neurodivergence” là ô rộng, không phải diagnosis duy nhất. Báo cáo tập trung vào attention switching, working memory, processing load, predictability và sensory load trong công việc; không tuyên bố đại diện mọi người ADHD/autistic/dyslexic.
- Báo cáo không đánh giá giá trị con người hoặc xếp hạng cộng đồng; điểm chỉ đo rủi ro PoC.

## 1.3 Điều mới so với vòng nghiên cứu trước

| Cập nhật mới | Ý nghĩa đối với quyết định |
|---|---|
| W3C CTAUR 2025 về accessibility của collaboration tools | Xác nhận vấn đề không chỉ là caption accuracy; multi-location updates, notification và cognitive demand là barrier hệ thống |
| CapTune, ASSETS 2025 | Củng cố thiết kế caption có viewer-controlled customization; richness và cognitive load có trade-off |
| EvolveCaptions, ASSETS 2025 | Cho thấy correction/collaboration có thể trở thành một phần experience, không chỉ hậu xử lý |
| PhoASR-whisper-small, PhoWhisper và VietASR | Có nhiều đường ASR tiếng Việt open-source đáng benchmark; model 2026 thêm word timestamps nhưng vẫn cảnh báo accent/rare-term limitations |
| Common Voice scripted v26/spontaneous v4 (06/2026) | Nguồn speech mở tiếp tục được cập nhật; hữu ích cho benchmark, nhưng phải kiểm tra subset/license tại thời điểm tải |
| VSL400, Scientific Data 08/2026 | Tài nguyên VSL tiến bộ rõ, nhưng vẫn là isolated-word dataset và access có kiểm soát; không nên là critical path của PoC |

---

# 2. Deep Dive — Deaf or Hard of Hearing

## 2.1 Không bắt đầu từ giả định “DHH = cần phụ đề”

DHH bao gồm phổ trải nghiệm rất khác nhau: Deaf, hard of hearing, late-deafened; người dùng sign language hoặc không; người dùng hearing aid/cochlear implant hoặc không; khả năng đọc ngôn ngữ viết, preference và identity cũng khác nhau. W3C ghi nhận rào cản từ audio không caption/transcript, voice-only services và thiếu sign-language interpretation, đồng thời không coi một modality là phù hợp cho tất cả. [W3C — Auditory disabilities](https://www.w3.org/WAI/people-use-web/abilities-barriers/auditory/).

Caption đúng không chỉ là chuỗi chữ. Với media, W3C yêu cầu nội dung tương đương phải bao gồm lời thoại, xác định người nói khi cần và thông tin âm thanh phi ngôn ngữ có ý nghĩa. [W3C — Captions (Prerecorded)](https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html), [W3C — Captions/Subtitles](https://www.w3.org/WAI/media/av/captions/).

## 2.2 Pain map theo employee journey

| Giai đoạn | Barrier thực tế | Hậu quả employability | Baseline hiện tại | Gap đáng làm |
|---|---|---|---|---|
| Tuyển dụng/phone screen | Voice-only call, tên riêng và jargon bị ASR sai | Bỏ lỡ câu hỏi, phải tự disclosure/đòi accommodation | Phone captions/live captions | Glossary theo job, uncertainty, correction nhanh, alternate channel |
| Onboarding/training | Video thiếu caption chuẩn; trainer nói khi đang chỉ slide | Không nắm quy trình hoặc phụ thuộc đồng nghiệp | Auto captions, transcript | Speaker/context link, search/timestamp, persistent evidence |
| Daily stand-up | Người nói nhanh, đổi lượt, cross-talk | Mất ownership/action item | Meet/Teams/Zoom caption | Ai nói, điều gì quyết định, đoạn nào không chắc |
| Hybrid meeting | Người trong phòng xa mic; remote/in-room audio lệch | Remote participant bị đứng ngoài nhịp thảo luận | Conference transcription | Mic quality indicator, correction loop, structured timeline |
| Informal work | Trao đổi hành lang/âm thanh báo hiệu | Thiếu “incidental information” và cơ hội networking | Smartphone live transcribe/sound alerts | Context, priority, privacy; không báo động giả quá mức |
| Sau cuộc họp | Transcript dài, lỗi tên riêng; không rõ quyết định | Tốn công xác minh, rủi ro accountability | Generic AI recap | Summary gắn evidence; user-confirmed action; audit trail |

### “Gap chết người” của thị trường

Android Live Transcribe đã cung cấp transcript thời gian thực, sound labels, custom words và một số khả năng offline; Microsoft Teams có live captions, CART, chỉnh font/màu/vị trí/số dòng, nhưng captions không được lưu nếu không bật transcription riêng; Apple Live Captions cũng là baseline mạnh và chính Apple cảnh báo độ chính xác có thể thay đổi, không dùng cho tình huống high-risk. Vì vậy **một app chỉ đổi speech thành text gần như không có product thesis mới**. [Android Live Transcribe](https://support.google.com/accessibility/android/answer/9158064?hl=en), [Microsoft Teams live captions](https://support.microsoft.com/en-us/teams/meetings/use-live-captions-in-microsoft-teams-meetings), [Apple Live Captions](https://support.apple.com/en-by/guide/iphone/iphe0990f7bb/ios).

Khoảng trống có giá trị hơn là:

- **Trust:** từ nào không chắc, người dùng sửa thế nào, correction có áp dụng cho lần sau không?
- **Context:** ai nói, lúc nào, liên quan slide/action nào, âm thanh nào thực sự có nghĩa?
- **Agency:** người dùng chọn độ dày caption, vị trí, kích thước, loại sound cue; không bị creator/AI áp một layout.
- **Continuity:** khi bỏ lỡ một đoạn, có thể khôi phục mạch mà không cần giơ tay yêu cầu cả phòng nói lại.
- **Privacy:** audio cuộc họp không mặc định bị đưa lên cloud hoặc lưu vô hạn.

## 2.3 Công nghệ và mức sẵn sàng

| Thành phần | Candidate | Mức sẵn sàng PoC | Lưu ý quyết định |
|---|---|---:|---|
| Vietnamese ASR — candidate 2026 | **PhoASR-whisper-small** qua Transformers | Cao | 0,2B; word timestamps; BSD-3-Clause-Clear + Qualcomm Responsible AI License; model card cảnh báo accent miền Trung và thuật ngữ hiếm |
| Vietnamese ASR — đường đơn giản | **PhoWhisper-base/small** | Cao | BSD-3-Clause; fine-tune multilingual Whisper trên 844 giờ; tích hợp nhanh, vẫn phải benchmark domain thật |
| Vietnamese ASR — đường tham vọng | **VietASR** checkpoint/Zipformer pipeline | Trung bình | Apache-2.0; repo công bố checkpoint từ 70.000 giờ pseudo-labeled; setup icefall/k2 phức tạp hơn |
| VAD | Silero VAD/WebRTC VAD | Cao | Dùng chunking/endpointing; không coi silence là “không chú ý” |
| Speaker attribution | pyannote.audio hoặc speaker buttons/known-speaker enrollment | Trung bình | Diarization live dễ lag; trong demo nên có manual/known-speaker fallback |
| Meaningful sounds | YAMNet/TFLite hoặc ONNX | Cao | 521 lớp AudioSet; chỉ bật allowlist 3–5 âm, không làm safety alarm |
| Transcript transport | WebRTC/getUserMedia + AudioWorklet + WebSocket | Cao | Prewarm model, ring buffer, reconnect strategy |
| Local inference | ONNX Runtime Web/WebGPU hoặc local Python service | Trung bình–Cao | Browser support/hardware thay đổi; local service ổn định hơn cho sân khấu |
| Evaluation data | Common Voice Vietnamese + scripted in-domain meeting | Cao | Common Voice để diversity benchmark; fixture riêng để đo tên/jargon/workplace |

Nguồn: [PhoASR-whisper-small model card](https://huggingface.co/Qualcomm-AI-Research/PhoASR-whisper-small), [PhoASR paper — EACL 2026](https://aclanthology.org/2026.findings-eacl.345/), [PhoWhisper model card](https://huggingface.co/vinai/PhoWhisper-base/blob/main/README.md), [VietASR official repository](https://github.com/zzasdf/VietASR), [Common Voice datasets](https://commonvoice.mozilla.org/en/datasets), [YAMNet](https://www.tensorflow.org/hub/tutorials/yamnet), [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/).

### VSL: đáng theo dõi, không nên làm MVP

VSL400 công bố tháng 08/2026 gồm 74.259 clip, 400 gloss và 28 signer, là bước tiến quan trọng cho Vietnamese Sign Language recognition. Tuy nhiên đây là **isolated-word recognition**, video access có kiểm soát theo Data Use Agreement, khác xa bài toán continuous, coarticulated, context-rich translation trong phòng họp. [VSL400 record](https://zenodo.org/records/17943574), [VSL400 — Scientific Data](https://www.nature.com/articles/s41597-026-08040-2).

Quyết định: không làm “universal VSL translator”. Nếu đội có Deaf/VSL collaborator và muốn thêm yếu tố VSL, chỉ nên dùng **curated sign-video responses** hoặc vocabulary 10–20 phrase được cộng đồng kiểm duyệt, không đặt nó trên critical path.

## 2.4 Rủi ro đặc thù DHH và mitigation

| Rủi ro | Xác suất/ảnh hưởng | Mitigation trong hackathon |
|---|---|---|
| ASR sai tên riêng/jargon/accent | Cao/Cao | Job glossary; highlight confidence; correction; fixture tiếng Việt; benchmark 20 key terms |
| Caption trễ làm người dùng tụt nhịp | Trung–Cao/Cao | Chunk nhỏ; partial caption; latency badge; không chờ LLM mới render transcript |
| Cross-talk làm sai speaker | Cao/Trung–Cao | 2 known speakers; push-to-identify/manual chip; nói rõ limitation |
| Thông tin “âm thanh” gây nhiễu | Trung/Trung | Allowlist, priority và snooze; người dùng chọn cue; không show mọi lớp YAMNet |
| AI summary sửa sai lời gốc | Trung/Cao | Immutable transcript; evidenceIds; summary ở lớp riêng; confirmation trước export |
| Thu âm không consent | Trung/Cao | Consent screen; indicator luôn thấy; raw audio off by default; Delete/retention control |

---

# 3. Deep Dive — Neurodivergence

## 3.1 Tránh thiết kế theo stereotype

W3C mô tả cognitive accessibility qua nhiều chức năng như attention, memory, language, perception, problem solving và comprehension; WHO nhấn mạnh trải nghiệm và nhu cầu của người autistic rất đa dạng. Một chế độ “ADHD mode” cố định vừa thiếu chính xác vừa có nguy cơ stigmatize. [W3C Cognitive Accessibility](https://www.w3.org/WAI/cognitive/), [WHO — Autism](https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders).

Thiết kế đúng là cung cấp các **điều khiển chức năng**: giảm chuyển động, hạ mật độ, gom notification, giữ vị trí, diễn giải change, xem một bước, xem evidence — người dùng tự chọn, không phải chứng minh diagnosis.

Bằng chứng workplace mới năm 2026 cũng đẩy vấn đề ra khỏi mô hình “deficit của cá nhân”: một nghiên cứu participatory với 20 autistic adults tại Singapore ghi nhận workplace thường mặc định các chuẩn neurotypical, tạo khó khăn từ instruction mơ hồ, executive-function demand và quy tắc giao tiếp ngầm; người tham gia quan tâm đến AI hỗ trợ structure và mutual understanding. Đây là tín hiệu thiết kế có giá trị cho bối cảnh châu Á, nhưng sample nhỏ và không đại diện Việt Nam. [Kan et al., Frontiers in Psychiatry, 2026](https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2026.1825357/full).

## 3.2 Pain map theo employee journey

| Giai đoạn | Barrier thực tế | Hậu quả employability | Baseline hiện tại | Gap đáng làm |
|---|---|---|---|---|
| Chuẩn bị họp | Agenda mơ hồ, đổi lịch bất ngờ | Tăng transition cost/anxiety; vào họp thiếu context | Calendar reminder | “What changed / what stays / what next” |
| Trong họp | Nghe + đọc chat + xem slide + ghi chú + self-view | Cognitive/sensory overload, mất mạch | Transcript, blur background, focus mode | One-locus view, notification budget, state continuity |
| Bị gián đoạn | Topic đổi khi attention rời đi | Không biết đang ở đâu, ngại hỏi lại | Generic recap | Now / Before / Next có timestamp |
| Nhận action | Ngôn ngữ ngầm, deadline/owner không rõ | Task initiation khó, sai kỳ vọng | AI notes/task tools | Evidence-bound action + human confirm |
| Đọc tài liệu/form | Mật độ cao, UI bất ngờ, timeout/error mơ hồ | Tốn thời gian, bỏ dở task | Reading mode, extensions | Reversible progressive disclosure, preserve original/state |
| Notification/chat | Nhiều thông báo ngang nhau | Context switching liên tục | Do Not Disturb | Priority, batch, suppress/acknowledge theo preference |

Nghiên cứu Microsoft với autistic adults trong video calling chỉ ra sensory sensitivities, cognitive load và anxiety định hình lựa chọn kênh; người tham gia phải chủ động điều tiết input và xây coping strategies. Một nghiên cứu hybrid-meeting với 21 professionals with disabilities (gồm người DHH và neurodivergent) mô tả rõ split attention, audio/cross-talk và nhiều luồng hội thoại tạo thêm “access tax”. W3C CTAUR cũng nêu collaboration trong teleconference có thể trở nên cognitively burdensome, nhiều người không theo dõi được nhiều vị trí đồng thời. [Microsoft Research — Managing Stress](https://www.microsoft.com/en-us/research/publication/managing-stress-the-needs-of-autistic-adults-in-video-calling/), [Alharbi et al. — Accessibility Barriers, Conflicts, and Repairs](https://doi.org/10.1145/3544548.3581541), [author PDF](https://www.microsoft.com/en-us/research/uploads/prod/2024/06/RahafPaper.pdf), [W3C CTAUR](https://www.w3.org/TR/ctaur/).

Nghiên cứu CHI 2025 với 20 người tự nhận ADHD cho thấy caption, playback speed và timestamp navigation có thể hỗ trợ, nhưng preference đối với dynamic highlighting trái chiều: có người cần stimulation/word highlighting, người khác thấy chính nó gây distraction. Kết luận an toàn là **cho người dùng chọn style/tốc độ**, không xây một “ADHD preset” duy nhất. [Jiang et al. — Shifting the Focus](https://lucyajiang.github.io/files/papers/CHI25-ADHDVideo.pdf).

## 3.3 Khoảng trống quyết định: cognitive continuity

Baseline như reading mode, focus settings, transcript và generic summary xử lý từng lát cắt. Khoảng trống mạnh nhất là một layer luôn trả lời, theo yêu cầu người dùng:

```text
NOW     Cuộc trao đổi đang ở chủ đề nào?
BEFORE  Quyết định quan trọng ngay trước khi tôi mất mạch là gì?
NEXT    Bước nhỏ kế tiếp, owner/deadline nào đã được nói rõ?
SOURCE  Tôi kiểm tra lại ở timestamp nào?
```

Khác biệt cốt lõi với chatbot tóm tắt:

- Không ép người dùng đọc một paragraph mới.
- Chỉ xuất tối đa 1–3 dòng theo progressive disclosure.
- Mọi dòng có source timestamp; không có evidence thì abstain.
- Exact transcript vẫn tồn tại cạnh bản đơn giản hóa.
- User quyết định font, density, motion, sound, auto-scroll và notification.

## 3.4 Công nghệ và mức sẵn sàng

| Thành phần | Cách làm đề xuất | Mức sẵn sàng | Guardrail |
|---|---|---:|---|
| Topic window | Sliding window + pause/topic markers + extractive sentences | Cao | Dùng rules làm fallback |
| Structured recap | LLM trả JSON `{now,before,next,evidenceIds,confidence}` | Cao | Schema validation; reject claim không có evidence |
| Action extraction | Rule + LLM candidate; user confirm owner/deadline | Cao | Không auto-create task/send message |
| Low-stimulation UI | CSS tokens, reduced motion, density presets, single-column | Cao | Không đặt tên profile theo diagnosis |
| Notification control | Priority + batch + acknowledge + snooze | Cao | Không dùng engagement optimization |
| Local persistence | IndexedDB/encrypted local cache/ephemeral session | Cao | Explicit export/delete |
| Browser/local AI | ONNX Runtime Web, Transformers.js hoặc local backend | Trung bình | Pre-cache model; fallback rules/extractive |

W3C COGA là supplemental guidance vượt ra ngoài compliance thuần túy, nhấn mạnh clear purpose, familiar patterns, help, simplification và testing với người có lived experience. [W3C COGA — Making Content Usable](https://www.w3.org/TR/coga-usable/).

## 3.5 Rủi ro đặc thù neurodivergence và mitigation

| Rủi ro | Xác suất/ảnh hưởng | Mitigation |
|---|---|---|
| “One-size-fits-all” làm tăng overload | Cao/Cao | Preset chỉ là điểm bắt đầu; granular controls; remember preference locally |
| Simplification làm mất nghĩa | Trung/Cao | Original luôn cạnh output; diff/undo; cấm thay thế legal/medical instruction |
| Summary hallucinate decision | Trung/Cao | EvidenceId bắt buộc; extraction-first; “Không đủ bằng chứng” |
| UI tự động thay đổi gây giật mình | Trung/Trung–Cao | Auto-scroll toggle; no surprise modal; reduced motion; announce changes |
| Hệ thống bị dùng để giám sát nhân viên | Trung/Rất cao | Không attention/productivity score; privacy statement; no employer dashboard trong MVP |
| Language infantilizing | Trung/Cao | Plain language không đồng nghĩa trẻ con; cho chọn mức chi tiết và xem nguyên bản |

---

# 4. Phần giao nhau — một bài toán, hai accessibility lenses

## 4.1 Shared need vs distinct need

| Thành phần | DHH cần gì | Neurodivergent user có thể cần gì | Shared component |
|---|---|---|---|
| Real-time content | Caption chính xác, speaker, sound | Ít luồng cạnh tranh, giữ mạch | Transcript event log |
| Density | Đủ lời và cue để tương đương | Có thể cần giảm mật độ/hiện dần | User-controlled renderer |
| Recovery | Xem lại đoạn bỏ lỡ | Now/Before/Next | Timestamp/evidence index |
| Correction | Sửa tên/jargon/ASR | Giảm ambiguity và cognitive repair | Glossary + correction memory |
| Notifications | Visual cue cho event quan trọng | Suppress/batch non-critical cues | Priority/notification budget |
| Trust | Biết máy không chắc ở đâu | Biết recap dựa trên câu nào | Confidence + provenance |

### Tension phải thiết kế, không được che giấu

Người DHH có thể cần caption verbatim cùng speaker/sound cues, trong khi một người dễ quá tải có thể muốn ít chữ và ít chuyển động. Giải pháp không phải chọn một bên, mà là:

```text
ONE EVIDENCE LAYER
verbatim transcript + speaker + timestamp + confidence
                         │
               user-controlled transform
            ┌────────────┼────────────┐
            ↓            ↓            ↓
       DHH View       Focus View   Combined View
    full caption +    1–3 dòng +   full transcript
    sound/context     no auto-scroll + on-demand recap
```

CapTune (ASSETS 2025) nghiên cứu caption tùy biến với 7 content creators và 12 DHH participants, cho thấy nhu cầu cân bằng expressive richness với cognitive load và ủng hộ viewer control trong giới hạn do creator định nghĩa. Đây là bằng chứng thiết kế hữu ích, không phải bằng chứng clinical hoặc product-market fit. [CapTune paper](https://soundability.eecs.umich.edu/img/portfolio/Huang_CapTune_ASSETS2025.pdf), [ACM DOI](https://doi.org/10.1145/3663547.3746346).

## 4.2 North-star problem statement

> **How might we help DHH and neurodivergent professionals follow, recover and act on fast-moving workplace conversations—without forcing everyone into the same display mode or surrendering trust to an opaque AI summary?**

Phiên bản tiếng Việt:

> Làm thế nào để người DHH và neurodivergent theo dõi, khôi phục và hành động từ một cuộc trao đổi công việc nhanh, mà không ép họ dùng cùng một cách hiển thị và không phải tin mù quáng vào tóm tắt AI?

## 4.3 Anti-goals

- Không “chữa”, “bình thường hóa” hoặc chấm điểm người dùng.
- Không thay interpreter/CART khi mức độ chính xác hoặc ngữ cảnh yêu cầu con người.
- Không tuyên bố phù hợp cho emergency, medical, legal hoặc performance appraisal.
- Không ghi hình/phân tích nét mặt để suy ra emotion/attention.
- Không đồng nhất VSL với ASL hoặc text caption.

---

# 5. Ba concept PoC đã hội tụ

## 5.1 Bảng chọn nhanh

Điểm `/10` là ước lượng của nhóm nghiên cứu trong điều kiện đội 3 người/3 ngày. Trọng số ưu tiên stability và user value hơn số lượng AI model.

| Concept | Feasibility | WOW | Dual-track fit | Stability | Differentiation | Responsible AI | Tổng `/60` |
|---|---:|---:|---:|---:|---:|---:|---:|
| **A. SignalFlow Meeting Companion** | 8.0 | 9.0 | 10.0 | 8.0 | 9.0 | 9.0 | **53.0** |
| B. Adaptive Caption Studio | 9.0 | 8.0 | 8.5 | 9.0 | 8.5 | 9.0 | 52.0 |
| C. QuietSignal Notification Router | 8.5 | 7.5 | 8.0 | 8.5 | 8.0 | 9.0 | 49.5 |

**Khuyến nghị:** chọn A làm hero; nếu streaming ASR không đạt latency/stability sau checkpoint Day 1, pivot sang B mà giữ lại gần như toàn bộ UI/evidence stack.

## 5.2 Concept A — SignalFlow Meeting Companion (khuyến nghị)

### Value proposition

Biến hội thoại biến mất ngay thành một **dòng bằng chứng có thể theo dõi và khôi phục**, sau đó render khác nhau theo preference của từng người.

### Feature set MVP

1. Live Vietnamese caption với partial/final state.
2. Speaker chip; cho phép gán/sửa speaker thủ công.
3. Highlight từ confidence thấp + one-tap correction + job glossary.
4. `I lost the thread` → Now / Before / Next, mỗi dòng mở được timestamp.
5. DHH / Focus / Combined view; font, density, auto-scroll, motion và sound cue tùy chỉnh.
6. Transcript gốc bất biến; export chỉ khi user xác nhận.
7. Offline fixture/extractive fallback.

### Full-stack architecture

```text
┌──────────────────────────── CLIENT: Next.js/React PWA ────────────────────────────┐
│ getUserMedia + AudioWorklet │ accessible controls │ DHH/Focus/Combined renderer │
└───────────────────────────────┬───────────────────────────────────────────────────┘
                                │ PCM chunks / WebSocket
┌───────────────────────────────▼───────────────────────────────────────────────────┐
│ FastAPI realtime orchestrator                                                    │
│  VAD → ASR → timestamp/confidence → speaker attribution → optional sound events │
└───────────────────────────────┬───────────────────────────────────────────────────┘
                                │ append-only events
┌───────────────────────────────▼───────────────────────────────────────────────────┐
│ Evidence layer: SQLite/IndexedDB                                                 │
│ utteranceId, speakerId, start/end, verbatimText, confidence, corrections         │
└───────────────────────────────┬───────────────────────────────────────────────────┘
              ┌─────────────────┴─────────────────┐
              ▼                                   ▼
  Deterministic/extractive pipeline      Optional grounded LLM
  glossary, topic window, fallback       strict JSON + evidenceIds
              └─────────────────┬─────────────────┘
                                ▼
                 Now / Before / Next + action candidates
                                ▼
                    user verifies → optional export
```

### Stack khuyến nghị

- **Frontend:** Next.js/React, TypeScript, Tailwind/CSS variables; ARIA live region dùng thận trọng; keyboard-first; service worker.
- **Realtime:** Web Audio API/AudioWorklet, WebSocket; avoid base64 nếu có thể.
- **Backend:** FastAPI, Pydantic schema, SQLite cho session demo.
- **ASR:** benchmark PhoASR-whisper-small và PhoWhisper-base/small trên cùng fixture; nếu máy/GPU không đủ, dùng prerecorded chunk hoặc cloud ASR fallback có consent. Không gọi model nào “tốt nhất” trước phép đo in-domain.
- **VAD:** Silero VAD.
- **Speaker:** demo với two-speaker enrollment/manual speaker toggle trước khi thử pyannote.
- **Sound event:** YAMNet allowlist `[door knock]`, `[alarm]`, `[applause]` nếu còn thời gian.
- **LLM:** model nào sẵn có nhưng bắt buộc structured output; temperature thấp; chỉ dùng transcript window; validate evidence.
- **Storage/privacy:** session local; raw audio không lưu mặc định; delete session rõ ràng.

### WOW demo 3–5 phút

**0:00–0:30 — Barrier.** Hai thành viên bắt đầu một cuộc họp tiếng Việt có tên dự án, deadline, một từ chuyên môn và tiếng gõ cửa. Màn hình default cố ý đông, khán giả thấy thông tin biến mất nhanh.

**0:30–1:30 — DHH View.** Caption hiện speaker, timestamp và `[tiếng gõ cửa]`. Một tên riêng confidence thấp được highlight; người dùng sửa một lần, glossary cập nhật các occurrence liên quan.

**1:30–2:30 — Focus View.** Tắt auto-scroll/chuyển động, ẩn cue không ưu tiên. Người dùng bấm **“Tôi mất mạch”**; Now/Before/Next xuất hiện, mỗi dòng mở đúng câu nguồn.

**2:30–3:30 — One evidence, multiple views.** Chuyển ngay giữa DHH/Focus/Combined để chứng minh không tạo hai sản phẩm rời rạc. Người dùng xác nhận action item; hệ thống không tự gửi gì.

**3:30–4:15 — Responsible AI.** Cố tình đưa câu mơ hồ; hệ thống hiện “Chưa đủ bằng chứng để xác nhận deadline” thay vì bịa. Tắt network; transcript/extractive recap vẫn hoạt động từ fixture/local path.

**4:15–5:00 — Evidence.** Hiện dashboard nhỏ: caption latency, key-term accuracy, evidence coverage, context-recovery time; kết bằng before/after của một task thực.

### Rủi ro và kế hoạch hardening

| Failure mode | Design response |
|---|---|
| Model cold start | Preload trước pitch; health indicator; warm-up fixture |
| Wi-Fi chết | Local ASR hoặc prerecorded deterministic fixture; không phụ thuộc một API |
| Diarization lag | Manual/known-speaker control là fallback chính thức |
| LLM chậm | Caption không chờ LLM; extractive Now/Before/Next xuất trước |
| LLM hallucinate | Schema/evidence validator; abstain; original transcript luôn mở được |
| Mic/echo | USB/close mic; preflight permissions; recorded audio injection switch |

## 5.3 Concept B — Adaptive Caption Studio

**Giá trị:** một caption player nơi viewer chọn verbatim/compact, font/background/position, speaker/sound richness và tốc độ hiển thị; creator cung cấp anchor, user giữ quyền hiển thị.

```text
Video + caption track
 → transcript/cue editor + correction
 → caption semantic tokens {speech, speaker, sound, uncertainty}
 → per-viewer renderer presets
 → comprehension/preference test
```

- **DHH value:** caption giàu context, correction và customization.
- **Neuro value:** kiểm soát density, motion, số dòng, progressive disclosure.
- **WOW:** cùng một clip được render ba cách ngay lập tức; user kéo “context richness” và “visual load”; original evidence không đổi.
- **Độ khó:** Thấp–Trung bình; rất ổn định vì không cần live ASR.
- **Gap:** bớt “real-time AI magic”; cần kể bằng tension richness–load và user agency.
- **Nguồn gợi ý:** CapTune; EvolveCaptions demo về collaborative ASR correction. [EvolveCaptions paper](https://soundability.eecs.umich.edu/img/portfolio/Wu_EvolveCaptions_ASSETS2025.pdf).

## 5.4 Concept C — QuietSignal Notification Router

**Giá trị:** hợp nhất speech/sound/chat events thành notification có priority, cho người dùng chọn text/visual/haptic, batch, snooze và acknowledge.

```text
Mic sound events + meeting events + synthetic chat fixture
 → event normalizer
 → user-authored priority rules
 → visual/haptic/quiet queue
 → audit: why this alert appeared
```

- **DHH value:** meaningful sound awareness và visual/haptic alternatives.
- **Neuro value:** giảm interruption, batch low-priority alerts, predictable acknowledgement.
- **WOW:** phát knock/alarm/chat; hai profile nhận output khác nhau; người dùng điều chỉnh rule ngay.
- **Độ khó:** Thấp–Trung bình.
- **Guardrail:** awareness aid, không phải certified emergency detector; rule do user đặt, không AI suy ra “mức stress”.

---

# 6. Thiết kế SignalFlow chi tiết

## 6.1 Data contract — phần quan trọng nhất

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

Validation rule:

```text
Nếu một field có nội dung nhưng evidenceIds rỗng
→ không render như fact
→ chuyển thành “AI suggestion — chưa đủ bằng chứng” hoặc bỏ field.
```

## 6.2 UX specification

### DHH View

- 2–3 dòng caption; speaker bằng tên + shape, không chỉ màu.
- Meaningful non-speech sound ở style riêng, chỉ từ allowlist.
- Confidence thấp dùng underline/icon, không flash.
- Correction bằng keyboard; custom-word glossary có preview.
- Transcript/search mở theo yêu cầu; không auto-collapse evidence.

### Focus View

- Một cột, reduced motion, optional no auto-scroll.
- Chỉ chủ đề hiện tại + một action candidate.
- Notification thấp được gom; change có text rõ, không chỉ màu/animation.
- “I lost the thread” luôn cùng vị trí và keyboard shortcut.
- Original transcript cách tối đa một thao tác.

### Combined View

- Caption verbatim ở trung tâm.
- Recap thu gọn bên cạnh/dưới; không cạnh tranh với caption.
- Sound cues và chat chỉ hiện khi priority threshold cho phép.

## 6.3 Accessibility acceptance criteria

- Toàn bộ hero flow dùng được bằng keyboard; focus visible và order ổn định.
- Không truyền thông tin chỉ bằng màu; speaker có text/shape.
- Resize 200%, responsive, không mất action hoặc transcript.
- Reduced-motion được tôn trọng; không auto-scroll nếu user tắt.
- Caption contrast/size/line count có điều khiển.
- Live region không đọc lặp partial caption liên tục; chỉ announce final/priority event theo preference.
- Original text, correction history và AI layer được phân biệt rõ.
- Delete session/export/consent dễ tìm và mô tả bằng plain language.

## 6.4 AI assurance

| Layer | AI được phép | AI không được phép |
|---|---|---|
| ASR | Transcribe, confidence, candidate alternatives | Che giấu uncertainty hoặc tự sửa evidence không log |
| Speaker/audio | Candidate speaker/sound label | Nhận diện danh tính trái phép; emotion inference |
| Recap | Trích/diễn đạt ngắn từ evidence window | Bịa decision, deadline, intent hoặc diagnosis |
| Personalization | Áp setting user đã chọn | Suy disability/profile từ hành vi |
| Action | Đề xuất candidate để confirm | Auto-email/task hoặc performance record |

Áp dụng tư duy NIST: govern, map, measure, manage; xác định harm, đo trên ngữ cảnh dùng và cung cấp failure handling thay vì chỉ tối ưu benchmark. [NIST AI 600-1 — Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf).

---

# 7. Dữ liệu, model, license và quyết định build/buy

| Asset | Dùng để làm gì | Access/license theo nguồn | Quyết định |
|---|---|---|---|
| PhoASR-whisper-small | ASR tiếng Việt | BSD-3-Clause-Clear + Qualcomm Responsible AI License; research/education intended use | **Primary benchmark candidate; kiểm tra terms trước submission/deployment** |
| PhoWhisper | ASR tiếng Việt | BSD-3-Clause trên model card | Fast integration fallback |
| VietASR | ASR tiếng Việt nâng cao | Apache-2.0 repo; checkpoint công khai | Stretch/benchmark, không critical path |
| Whisper/faster-whisper | Baseline multilingual/inference | Whisper MIT; kiểm tra wrapper/model cụ thể | Fallback và tooling |
| Common Voice | Speech benchmark đa dạng | Kiểm tra datasheet/release của subset tải | Evaluation, không fine-tune trong 3 ngày |
| AMI Meeting Corpus | Speaker/meeting pipeline test | Corpus cung cấp transcript/annotations; re-check từng component | English technical benchmark |
| QMSum | Query-based meeting summarization | Paper/dataset gốc | Evaluation prototype, không đại diện tiếng Việt |
| YAMNet | Meaningful sound candidates | TensorFlow Hub model/tutorial | Optional allowlist only |
| VSL400 | VSL isolated-word research | Controlled access/DUA | Future work, không MVP |

Nguồn: [OpenAI Whisper](https://github.com/openai/whisper), [AMI Corpus](https://groups.inf.ed.ac.uk/ami/corpus/), [QMSum paper](https://aclanthology.org/2021.naacl-main.472/), [Mozilla Common Voice](https://commonvoice.mozilla.org/en/datasets).

### Benchmark gate trước khi khóa model

Tạo một test pack 8–10 phút, không cần train:

- 2 người nói tiếng Việt; 2 accent nếu có.
- 20 từ khóa: tên người, project, acronym, deadline.
- 3 điều kiện: quiet, background office noise, short overlap.
- Gold transcript do người kiểm tra thủ công.

Đo:

- WER/CER tham khảo.
- **Key-term accuracy** — quan trọng hơn WER tổng cho demo.
- Median/p95 caption finalization latency.
- Tỷ lệ gán đúng speaker trong đoạn không overlap.
- Correction time cho một tên sai.

Model chỉ được chọn sau benchmark trên đúng laptop demo. Claim từ paper/model card không thay thế phép đo này.

---

# 8. Evaluation plan — chứng minh tác động trong hackathon

## 8.1 Chỉ số primary

| Outcome | Metric | Target PoC | Cách đo |
|---|---|---:|---|
| Tiếp nhận từ khóa | Key-term accuracy | ≥ 90% trên scripted quiet fixture | 20 term gold list |
| Tốc độ caption | Median final latency | ≤ 2,0 giây | timestamp audio → final cue |
| Khôi phục mạch | Context-recovery time | Giảm ≥ 30% so với dò transcript | 3 câu hỏi Now/Before/Next |
| Trust | Evidence coverage | 100% recap factual fields có evidenceIds | automated schema check |
| Sửa lỗi | Correction completion | ≤ 2 thao tác chính | usability observation |
| Stability | Consecutive clean runs | 3/3 | rehearsal cùng máy/mic/network plan |

Các target trên là **acceptance thresholds do đội đề xuất**, chưa phải chuẩn ngành.

## 8.2 Mini study khả thi

Nếu có 2–5 người tham gia co-design/test, dùng within-subject task ngắn:

1. Xem đoạn meeting 90 giây ở baseline transcript.
2. Trả lời: topic hiện tại, quyết định trước đó, owner/deadline.
3. Lặp với SignalFlow trên một clip khác có độ khó tương đương.
4. Ghi accuracy, recovery time, số lần phải dò, perceived workload 1–5 và preference.
5. Phỏng vấn: thông tin nào thừa, cue nào gây khó chịu, setting nào muốn giữ.

Không gộp kết quả DHH và neurodivergent participants thành một average duy nhất nếu nhu cầu trái chiều. Báo cáo theo từng profile/task và ghi sample cực nhỏ.

## 8.3 Câu hỏi co-design nên hỏi

### Với DHH collaborator

- Khi caption sai, loại lỗi nào gây hậu quả lớn nhất?
- Speaker label, sound cue và confidence nên xuất hiện thế nào?
- Caption verbatim hay edited/compact hữu ích trong bối cảnh nào?
- Khi nào cần interpreter/CART thay vì sản phẩm này?

### Với neurodivergent collaborator

- Thành phần nào trong meeting gây overload: audio, faces, chat, motion, density hay ambiguity?
- “Mất mạch” được nhận biết và khôi phục như thế nào hiện nay?
- Auto-scroll, notification và recap nên bật theo cách nào?
- Plain language ở đâu hữu ích, ở đâu gây khó chịu/mất nghĩa?

### Với người giao thoa hai nhóm

- Tension giữa caption đầy đủ và overload xảy ra lúc nào?
- Preset nào thực sự giúp; switch mode giữa cuộc họp có gây thêm tải không?
- Điều gì khiến họ tin hoặc không tin AI recap?

---

# 9. Kế hoạch 3 ngày và kill criteria

## Trước hackathon

- Cache model và dependencies; license inventory.
- Chuẩn bị gold audio fixture + transcript + 20 keywords.
- Skeleton PWA, accessible design tokens, fake transcript event stream.
- Viết interview guide; mời tối thiểu 1 DHH và 1 neurodivergent reviewer nếu có thể.

## Day 1 — Learn & Frame

| Thời điểm | Việc phải hoàn tất | Gate |
|---|---|---|
| Sáng | End-user input; problem statement; 1 hero journey | Pain point được xác nhận hoặc chỉnh |
| Trưa | Benchmark PhoWhisper/fallback trên laptop | Chọn ASR dựa trên latency/key-term accuracy |
| Chiều | Evidence schema + fake/live event stream + 2 views | UI chạy ngay cả khi AI chưa sẵn sàng |
| Cuối ngày | Test streaming 3 lần | Nếu không ổn, pivot prerecorded/Adaptive Caption Studio |

## Day 2 — Build & Test

- Hoàn thiện caption/correction/glossary.
- Implement deterministic/extractive Now/Before/Next.
- Chỉ thêm LLM sau khi evidence validation pass.
- Keyboard/reduced-motion/live-region test.
- User feedback vòng 1; cắt feature không giải quyết hero flow.

## Day 3 — Harden & Pitch

- Failure injection: tắt network, từ lạ, speaker sai, câu deadline mơ hồ.
- Rehearse 3 consecutive runs; quay video backup dưới 5 phút.
- Slide chỉ giữ: person/task → barrier → evidence → solution → demo → metric → responsible AI → path to scale.
- Product pitch nói rõ limitation; không tuyên bố đại diện cộng đồng nếu chưa co-design đủ.

## Kill criteria

- **Bỏ live diarization** nếu speaker latency/error làm caption khó đọc sau 2 giờ tuning.
- **Bỏ YAMNet** nếu false alerts xuất hiện >1 lần trong scripted demo.
- **Bỏ generative recap** nếu bất kỳ factual field nào không giữ evidence link; dùng extractive recap.
- **Pivot sang Concept B** nếu streaming ASR không đạt 3 clean runs cuối Day 1.
- Không bao giờ bỏ transcript/evidence/fallback để giữ một hiệu ứng AI.

## Phân vai đội 3 người

| Vai trò | Trách nhiệm chính |
|---|---|
| Product/A11y lead | Co-design, scope, UX copy, keyboard/accessibility QA, pitch/evaluation |
| Frontend/realtime lead | Audio capture, PWA, renderer profiles, state/fallback, instrumentation |
| AI/backend lead | ASR/VAD, evidence service, recap validator, benchmark/privacy |

---

# 10. Pitch strategy theo tiêu chí ADC

| Tiêu chí | Điều BGK cần thấy | Bằng chứng trên sân khấu |
|---|---|---|
| Innovation & Impact | Không phải caption clone; giải quyết participation + recovery | One evidence timeline, multiple views, correction và evidence-bound recap |
| User-Centred Design & Accessibility | Nhu cầu khác nhau không bị ép chung | Live switch DHH/Focus; setting do user chọn; co-design quote/iteration |
| Feasibility & Practicality | MVP chạy trên commodity laptop/browser | Local/fallback, 3-day scope, latency/stability metrics |
| Use of AI | AI có vai trò cần thiết và responsible | ASR + structured recap; confidence/evidence/abstention |
| Presentation & Communication | Một câu chuyện rõ, không feature tour | Barrier → user action → recovery → measurable outcome |

### Positioning 30 giây

> Workplace conversations disappear the moment they are spoken. For Deaf and hard-of-hearing professionals, the missing layer may be accurate captions, speakers and sound context. For neurodivergent professionals, it may be the ability to filter overload and recover the thread after an interruption. SignalFlow creates one trustworthy evidence timeline and lets each person choose how to receive it—full captions, a low-stimulation view, or an evidence-linked Now/Before/Next recap. AI assists, but it never overwrites the original conversation or acts without confirmation.

### Câu hỏi khó dự kiến

**“Teams/Meet đã có captions và AI notes; khác biệt ở đâu?”**  
Baseline biến speech thành text và tóm tắt cho số đông. SignalFlow đặt accessibility agency ở trung tâm: correction/uncertainty, viewer-controlled cognitive load, context recovery có timestamp và fallback không bịa.

**“Tại sao hai lĩnh vực này chung một sản phẩm?”**  
Chung evidence pipeline nhưng khác renderer. Đội không nói nhu cầu giống nhau; đội thiết kế một hạ tầng thông tin có thể thích ứng mà không phân tách người dùng.

**“Tại sao không làm sign language?”**  
VSL là ngôn ngữ đầy đủ và bài toán translation cần dữ liệu/co-design lớn. VSL400 hiện là isolated-word, controlled access. Hứa translation tổng quát trong 3 ngày sẽ thiếu trung thực và khó ổn định.

**“AI summary sai thì sao?”**  
Mọi factual field cần evidenceIds; không có evidence thì hệ thống abstain. Caption/transcript không chờ và không bị LLM sửa; user xác nhận action.

**“Có đang giám sát nhân viên không?”**  
Không emotion/attention/productivity score, không employer dashboard. Local/ephemeral by default, consent rõ, export/delete do user điều khiển.

---

# 11. Roadmap sau hackathon

| Giai đoạn | Mục tiêu | Điều kiện trước khi mở rộng |
|---|---|---|
| PoC | 2-speaker Vietnamese meeting, 2 views, evidence recap | Stability + accessibility smoke test |
| Pilot | Zoom/Teams companion hoặc meeting-room web app; organization glossary | Consent/legal review; DHH + neuro co-design |
| Product beta | Personal profiles, multilingual captions, admin-free deployment | Security, retention, model monitoring, human support |
| Scale | SDK/API cho learning, onboarding và support call | Procurement, compliance, outcome evaluation |

Business path hợp lý là **B2B2E accommodation layer** hoặc SDK cho workplace/learning platforms. Tuy nhiên, tránh mô hình bán surveillance analytics cho employer; value proposition nên là employee participation, meeting quality và accessible knowledge—not diagnosis or productivity scoring.

---

# 12. Risk register tổng hợp

| ID | Rủi ro | Severity | Early signal | Owner response |
|---|---|---:|---|---|
| R1 | Caption tiếng Việt không ổn định | High | Key-term <90%, latency >2s | Benchmark/pivot/fallback/glossary |
| R2 | Hai track trông như ghép cơ học | High | Demo phải mở hai app/flow | Một evidence schema, live switch renderer |
| R3 | Neuro feature thành “productivity tool” | High | Pitch nói efficiency nhiều hơn access | Center participation/recovery, co-design evidence |
| R4 | LLM hallucination | High | Recap field thiếu source | Validator + abstain + extractive fallback |
| R5 | Privacy/consent | High | Raw audio/cloud mặc định | Local-first, indicator, explicit retention/delete |
| R6 | Overload do caption/effects | Medium–High | User tắt app/khó theo dõi | Density/motion/priority controls |
| R7 | Tokenistic validation | High | Chỉ có persona giả định | End-user session; disclose limitation |
| R8 | Dataset/license block | Medium | Access chưa duyệt | Không dùng controlled dataset trên critical path |
| R9 | Demo hardware/network glitch | High | Không đạt 3 clean runs | Prewarm, local fixture, video backup |

---

# 13. Kết luận và quyết định cuối

**DHH + Neurodivergence là một cặp mạnh cho ADC 2026** khi đội không cố tạo “một giải pháp cho hai loại khuyết tật”, mà xây một hạ tầng giao tiếp cho phép mỗi người kiểm soát modality, density và recovery.

Quyết định đề xuất:

1. Chọn **workplace meeting continuity** làm problem space.
2. Xây **SignalFlow** với một immutable evidence timeline và ba renderer modes.
3. Đặt caption/correction/Now-Before-Next/fallback trong MVP; diarization, sound events và LLM là lớp tăng cường có kill criteria.
4. Benchmark tiếng Việt trên laptop thật trước khi khóa PhoWhisper/VietASR/cloud fallback.
5. Co-design riêng với DHH và neurodivergent users; nếu có participant giao thoa, ưu tiên kiểm tra tension giữa caption richness và cognitive load.
6. Đo participation outcomes: key-term capture, recovery time, evidence coverage và clean-run stability.

Nếu phải cắt đến mức tối thiểu, giữ đúng khoảnh khắc này:

> Một cuộc họp đang chạy. Người dùng chuyển sang chế độ phù hợp với mình, sửa một caption quan trọng, bấm “Tôi mất mạch”, nhận ba dòng có timestamp, và thấy hệ thống từ chối bịa một deadline không được nói rõ.

Đó là một demo vừa trực quan, có chiều sâu accessibility, có AI cần thiết, và đủ trung thực để phát triển thành sản phẩm.

---

# Phụ lục A — Source map trọng yếu

## Competition / standards / lived-experience research

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

## Models / data / implementation

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

# Phụ lục B — Mức tin cậy và unresolved gaps

| Claim family | Evidence | Confidence | Khoảng trống còn lại |
|---|---|---:|---|
| ADC format/criteria | Official RMIT page | High | Brief chi tiết chỉ được release Day 1 |
| Collaboration/cognitive barriers | W3C + peer-reviewed qualitative research | High | Cần xác nhận bối cảnh Việt Nam |
| Caption customization | W3C + CapTune | Medium–High | Sample nhỏ; không suy rộng cho mọi user |
| Vietnamese ASR candidates | Model card/repo/paper | Medium–High | 500h dataset trong paper và 3000h model-training set có lineage khác nhau; không gộp hai claim; phải benchmark hardware/noise/accent thật |
| VSL scope | Scientific Data/Zenodo | High | Controlled access; không đánh giá live translation |
| Product scoring/targets | Analyst judgment | Medium | Phụ thuộc skill/GPU/API/co-design của đội |
| Market differentiation | Feature-level comparison | Medium | Chưa làm patent/pricing/procurement study |

**Unresolved research cần hoàn tất tại hackathon:** nhu cầu ưu tiên của người dùng địa phương; VSL/text preference; cách hiển thị confidence không gây overload; privacy expectation của doanh nghiệp; performance của ASR trên giọng/accent và microphone thực tế.
