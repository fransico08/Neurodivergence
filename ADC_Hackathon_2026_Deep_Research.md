# Báo cáo Deep Research — 4 lĩnh vực cho ADC Hackathon 2026

**Ngày nghiên cứu:** 04/09/2026  
**Bối cảnh quyết định:** đội full-stack, hackathon 3 ngày, demo 3–5 phút, ưu tiên web/mobile và commodity hardware.

## Kết luận điều hành

**Khuyến nghị chọn chính thức: Visual Impairment + Neurodivergence.** Đây là cặp cân bằng tốt nhất giữa tác động, tính mới, độ ổn định live và khả năng dùng chung một nền tảng web accessibility. Sản phẩm nên là **WorkLens Universal**: extension/PWA biến cùng một tài liệu hoặc workplace portal thành semantic HTML/TTS cho người mù, giao diện low-vision, và chế độ Focus/Now–Next cho người dùng neurodivergent.

**Cặp táo bạo cho hiệu ứng sân khấu: Deaf or Hard of Hearing + Visual Impairment.** Xây **BridgeRoom**, một meeting copilot tạo speaker-aware captions, nhãn âm thanh và mô tả có căn cứ cho screen share/chart. Cặp này gây cảm xúc mạnh nhưng audio/vision live có nhiều điểm lỗi hơn.

ADC 2026 thực tế là hackathon 3 ngày với chủ đề **AI & Employability**; tiêu chí công khai gồm Innovation & Impact, User-Centred Design & Accessibility, Feasibility & Practicality, Use of AI và Presentation ở vòng chung kết. Trang công khai nói giải pháp có thể tập trung vào **“one or more”** nhóm, không ghi bắt buộc đúng hai nhóm; yêu cầu chọn hai của đội vẫn được dùng làm ràng buộc chiến lược trong báo cáo này. [Nguồn chính thức RMIT ADC 2026](https://industryhub.rmit.edu.vn/ADC/), [form đăng ký và giới hạn từ](https://industryhub.rmit.edu.vn/ADC/register/).

### Kiến trúc nền tảng nên dùng chung

```text
Mic / Camera / DOM / PDF
        ↓ consent + local capture
Deterministic accessibility layer
(WCAG/COGA rules, OCR, semantic tree)
        ↓
On-device models
(MediaPipe, ONNX Runtime Web, Whisper/YAMNet nhỏ)
        ↓ khi thật sự cần
Cloud VLM/LLM đã redact dữ liệu
        ↓
Confidence + evidence + safety gate
        ↓
Caption / TTS / haptic / Focus view / accessible HTML
        ↓
User correction → local preferences → Undo/Delete
```

Nguyên tắc: **rules first, AI second, user last word**. ONNX Runtime Web cho phép inference qua WASM/WebGPU và có lợi thế offline/privacy; tuy nhiên WebGPU cần WASM fallback. [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/), [WebGPU execution provider](https://onnxruntime.ai/docs/tutorials/web/ep-webgpu.html). Với đầu ra generative, cần chống confabulation, data leakage và over-trust theo [NIST Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf).

---

# Phần 1 — Phân tích chuyên sâu từng lĩnh vực

## 1. Deaf or Hard of Hearing

### 1.1 Pain Points & User Journey

| Bối cảnh | Nỗi đau thực tế | Công cụ hiện có | Khoảng trống quyết định |
|---|---|---|---|
| Đời sống | Bỏ lỡ chuông cửa, cảnh báo, tên được gọi; hội thoại trong nền ồn | Sound Notifications, Sound Recognition, hearing devices | False positive/negative; thiếu ngữ cảnh, độ ưu tiên và privacy rõ ràng |
| Giáo dục/họp | Cross-talk, tên riêng, accent, slide + người nói + caption gây split attention | Live Transcribe/Live Captions, Meet/Teams/Zoom captions | Diarization, non-speech sound, latency, correction loop và glossary còn rời rạc |
| Việc làm | Phone call, onboarding video, hybrid meeting, thông báo voice-only | Caption, transcript, interpreter | Caption không đồng nghĩa sign language; text có thể không phải ngôn ngữ tiếp cận tối ưu của mọi người Deaf |
| Môi trường số | Audio thiếu transcript/caption; media player thiếu tùy chỉnh | WCAG media alternatives | Auto-caption không đủ để bảo đảm caption chính xác, đồng bộ và giàu thông tin |

W3C xác định rào cản chính gồm audio không có caption/transcript, voice-only services và thiếu sign language; đồng thời lưu ý không phải mọi người khiếm thính đều dùng sign language. Caption đúng phải chứa cả lời nói, speaker khi cần và âm thanh phi ngôn ngữ. [W3C Auditory Barriers](https://www.w3.org/WAI/people-use-web/abilities-barriers/auditory/), [W3C Captions](https://www.w3.org/WAI/media/av/captions/).

Baseline thị trường đã mạnh: Android Live Transcribe có speech/sound labels, custom words và offline cho một số ngôn ngữ; Apple Live Captions chạy on-device nhưng chính Apple cảnh báo độ chính xác thay đổi và không dùng trong tình huống rủi ro cao. Vì vậy, một app chỉ “speech-to-text” sẽ khó tạo khác biệt. [Android Live Transcribe](https://support.google.com/accessibility/android/answer/9158064?hl=en), [Apple Live Captions](https://support.apple.com/en-by/guide/iphone/iphe0990f7bb/ios).

**Gap đáng làm:** accessibility timeline cho cuộc họp gồm speaker + caption + meaningful sounds + uncertainty + action/evidence; hoặc sound awareness hoàn toàn on-device. **Không nên** hứa dịch sign language tổng quát.

### 1.2 Cơ hội công nghệ

- **Streaming ASR:** Whisper/faster-whisper + Silero VAD; Common Voice có tiếng Việt để benchmark accent/domain. Whisper là model multilingual MIT nhưng hiệu năng thay đổi đáng kể theo ngôn ngữ và môi trường. [OpenAI Whisper](https://github.com/openai/whisper), [Mozilla Common Voice](https://commonvoice.mozilla.org/en/datasets).
- **Speaker diarization:** pyannote hoặc speaker embedding nhẹ; AMI cung cấp khoảng 100 giờ dữ liệu họp đa phương thức và transcript CC BY 4.0. [AMI Meeting Corpus](https://groups.inf.ed.ac.uk/ami/corpus/).
- **Audio-event AI:** YAMNet phân loại 521 lớp từ AudioSet; phù hợp chuông/cửa/tiếng gõ, không phù hợp tuyên bố certified emergency detector. [YAMNet](https://www.tensorflow.org/hub/tutorials/yamnet).
- **Sign recognition miền hẹp:** MediaPipe Holistic/Hand/Face landmarks + temporal classifier. How2Sign có hơn 80 giờ continuous ASL nhưng chỉ research-use; VSL400 mới công bố 14/08/2026 có 74.259 clip, 400 gloss, 28 signer nhưng là **isolated word recognition** và video cần controlled access/DUA. [How2Sign](https://how2sign.github.io/), [VSL400 — Scientific Data](https://www.nature.com/articles/s41597-026-08040-2).
- **Edge AI:** AudioWorklet/WebRTC + ONNX/TFLite giúp giảm latency và tránh gửi raw audio mặc định.

### 1.3 Top 3 PoC

#### H1. MeetingLens — speaker-aware captions có uncertainty

**Value Proposition:** giúp người dùng theo dõi ai đang nói, nội dung gì, âm thanh nào quan trọng và đoạn nào máy không chắc.

```text
Next.js PWA + getUserMedia/AudioWorklet
 → FastAPI WebSocket gateway
 → faster-whisper + Silero VAD
 → pyannote diarization + YAMNet
 → glossary/correction service
 → caption timeline + transcript export
```

- **Data:** Common Voice Vietnamese; AMI meeting corpus; AudioSet/YAMNet.
- **WOW demo:** hai người nói, có overlap nhẹ và tiếng gõ cửa; UI hiện speaker chip, `[door knock]`, gạch chân tên riêng confidence thấp; sửa tên một lần rồi mọi occurrence cập nhật; cuối cùng xuất action items có timestamp.
- **Độ khó:** Trung bình.
- **Live risk:** noise, echo, diarization lag, cold start, Wi-Fi.
- **Hardening:** prewarm; buffer 1–2 giây; hai known speakers; local/prerecorded audio fallback; LLM chỉ tóm tắt transcript, không được sửa lời gốc.

#### H2. SoundBeacon — visual/haptic sound awareness on-device

**Value Proposition:** biến doorbell, knock, appliance beep, baby cry thành alert chữ + màu + mẫu rung riêng.

```text
Flutter/React Native
 → microphone ring buffer
 → YAMNet/PANNs TFLite hoặc ONNX
 → per-user threshold
 → visual alert + haptic pattern + optional watch
```

- **Data:** AudioSet; thêm 20–50 clip ghi trong đúng phòng demo để calibration.
- **WOW demo:** phát ba âm từ loa ẩn; điện thoại phân loại và rung khác nhau; one-tap feedback giảm một false positive ngay trên sân khấu.
- **Độ khó:** Thấp–Trung bình; stability cao.
- **Live risk:** microphone permission, ambient noise, battery, unsafe overclaim.
- **Guardrail:** ghi rõ “awareness aid”, không phải thiết bị báo cháy/khẩn cấp được chứng nhận.

#### H3. SignBridge Lite — VSL/text cho 20–30 workplace phrases

**Value Proposition:** giao tiếp hai chiều tại kiosk/check-in trong miền hẹp; không quảng bá “universal translator”.

```text
Webcam → MediaPipe hand + face + pose
 → temporal TCN/ST-GCN classifier
 → phrase → text/TTS

Speech reply → ASR
 → curated sign-video response đã được Deaf reviewer duyệt
```

- **Data:** VSL400 nếu được cấp quyền kịp; nếu không, thu bộ 20–30 phrase với consent cùng Deaf collaborator. WLASL/How2Sign chỉ dùng làm baseline kỹ thuật, không đại diện VSL.
- **WOW demo:** signer biểu đạt “Tôi cần hỗ trợ”; app đọc ra; người nghe trả lời bằng giọng nói và app mở video VSL đã kiểm duyệt.
- **Độ khó:** Trung bình cho closed vocabulary; Rất cao cho continuous translation.
- **Live risk:** occlusion, lighting, signer variation, regional language, non-manual markers.
- **Guardrail:** human/interpreter fallback; không dùng trong y tế, pháp lý hay khẩn cấp.

### 1.4 Feasibility & Constraints

**SDK/OSS sẵn sàng:** faster-whisper, Whisper, pyannote.audio, Silero VAD, YAMNet, MediaPipe, ONNX Runtime, WebRTC, Web Audio.  
**Điểm mạnh hackathon:** caption và sound alerts có input/output rất trực quan.  
**Điểm yếu:** sign-language demo dễ bị đánh giá là overclaim nếu vocabulary/dialect và co-design không được nói rõ.

---

## 2. Visual Impairment

### 2.1 Pain Points & User Journey

| Bối cảnh | Nỗi đau thực tế | Công cụ hiện có | Khoảng trống quyết định |
|---|---|---|---|
| Đời sống | Nhận diện vật, đọc nhãn, xây spatial map, camera framing | Seeing AI, Lookout, Be My Eyes | Vật ngoài frame, blur/occlusion, mô tả thiếu spatial relation, hallucination |
| Giáo dục | PDF scan, chart, equation, slide thiếu reading order/data equivalent | OCR, screen reader | OCR text chưa thành semantic document; chart answer thiếu evidence |
| Việc làm | Dashboard, inaccessible PDF, custom controls, unlabeled buttons | VoiceOver/TalkBack/Narrator, magnifier | Screen reader phụ thuộc semantic structure mà app doanh nghiệp thường làm sai |
| Low vision | Zoom làm mất context; glare, contrast, font/spacing khác nhau | Magnifier, contrast/font settings | Fixed layout vỡ khi phóng to; personalization không xuyên app |

W3C nêu rõ screen reader cần headings, lists, tables và controls được code đúng; rào cản gồm missing alt, insufficient contrast, layout không resize và navigation thiếu nhất quán. [W3C Visual Barriers](https://www.w3.org/WAI/people-use-web/abilities-barriers/visual/). Thị trường đã có Lookout và Seeing AI, nên “camera mô tả vật” chung chung không còn mới. Quan trọng hơn, Microsoft nói Seeing AI chỉ **augment** awareness, output là probabilistic và không dùng trong tình huống có thể gây chấn thương. [Seeing AI User Manual](https://www.microsoft.com/en-us/garage/wp-content/uploads/2025/04/Seeing-AI-User-Manual.pdf), [Google Lookout](https://support.google.com/accessibility/android/answer/9031274?hl=en-GB).

**Gap đáng làm:** grounding + framing coach + uncertainty cho một task an toàn, hoặc biến document/page thành semantic artifact có evidence. Không làm outdoor navigation trong 3 ngày.

### 2.2 Cơ hội công nghệ

- **Vision-language + grounding:** Florence-2/compatible VLM cho caption, OCR, detection, phrase grounding; dùng bounding box/crop làm evidence, không chỉ sinh prose.
- **Object detection/tracking:** YOLO nhỏ, MediaPipe Object Detector, SAM 2; giữ lock vào vật sau khi tìm thấy.
- **OCR & document layout:** PaddleOCR/PP-StructureV3 hoặc Tesseract + DocLayNet model; DocLayNet có 80.863 trang, 11 lớp layout, annotation thủ công. [DocLayNet](https://github.com/DS4SD/DocLayNet).
- **Authentic assistive data:** VizWiz-VQA bắt nguồn từ ảnh/câu hỏi do người mù chụp, có cả task dự đoán unanswerable — phù hợp để huấn luyện hành vi “không biết”. [VizWiz VQA](https://vizwiz.org/tasks-and-datasets/vqa/).
- **Accessibility runtime:** WAI-ARIA/accessibility tree + axe-core. Axe tự động tìm trung bình khoảng 57% vấn đề WCAG, vì thế phải giữ manual review. [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/), [axe-core](https://github.com/dequelabs/axe-core).
- **Depth/haptics:** monocular relative depth chỉ nên dùng “gần hơn/xa hơn”, không dùng khoảng cách an toàn tuyệt đối.

### 2.3 Top 3 PoC

#### V1. SceneCompass — object finder có framing coach

**Value Proposition:** tìm chìa khóa/cốc/tài liệu trên bàn bằng audio + haptic guidance; giải quyết cả vấn đề camera aim.

```text
Flutter/PWA camera
 → frame-quality checker
 → lightweight detector/VLM grounding
 → tracker + relative-depth bands
 → left/center/right TTS + haptic guidance
 → optional teachable-object store
```

- **Data:** VizWiz-VQA/Grounding, COCO, 10–20 ảnh đồ cá nhân.
- **WOW demo:** giấu chìa khóa giữa nhiều vật; app nói “dịch camera sang trái / vật bị cắt khỏi khung”, khóa object, rung nhanh dần khi căn đúng.
- **Độ khó:** Trung bình–Cao cho tabletop; Rất cao nếu navigation.
- **Live risk:** ánh sáng, occlusion, sai identity, VLM latency.
- **Hardening:** bàn và đèn kiểm soát; hai vật backup; local detector trước, cloud description sau; tuyệt đối không claim obstacle avoidance.

#### V2. DocWeaver — PDF/chart thành screen-reader-native HTML

**Value Proposition:** khôi phục reading order, headings, tables và chart description; câu trả lời luôn có source region/value.

```text
Accessible Next.js PWA
 → upload PDF/image
 → FastAPI worker
 → PaddleOCR/PP-StructureV3
 → table/chart extraction + VLM description
 → deterministic value validation
 → semantic HTML/ARIA + Markdown + TTS
```

- **Data:** DocLayNet, ChartQA, VizWiz-Captions; 2–3 fixture workplace documents.
- **WOW demo:** nạp một payslip hoặc chart KPI bị scan; app tạo heading/table, đọc trend; câu hỏi “tháng cao nhất?” highlight đúng bar/OCR value làm evidence.
- **Độ khó:** Trung bình; live stability cao.
- **Live risk:** OCR số sai, multi-column order, chart hallucination.
- **Hardening:** chỉ trả lời khi có evidence; confidence threshold; hiển thị original crop cạnh answer; fixture offline.

#### V3. AccessPatch — session-local accessibility repair

**Value Proposition:** extension phát hiện unlabeled controls/missing alt/focus/contrast, đề xuất patch tạm và xuất diff cho developer.

```text
Manifest V3 extension
 → axe-core + DOM/accessibility-tree scan
 → screenshot + nearby labels/context
 → local VLM/LLM label proposal
 → keyboard/voice command palette
 → reversible ARIA/CSS patch + export report
```

- **Data:** không cần fine-tune; dùng WCAG test fixtures và trang demo cố ý lỗi.
- **WOW demo:** screen reader đọc “unlabeled button”; extension tạo provisional label, focus indicator và alt; refresh trở về nguyên bản; export patch.
- **Độ khó:** Trung bình.
- **Live risk:** label sai, cross-origin iframe, extension permissions, prompt injection từ page text.
- **Guardrail:** nhãn “AI-proposed”; session-local; allowlist; không auto-submit; axe “incomplete” luôn chuyển manual review.

### 2.4 Feasibility & Constraints

**SDK/OSS:** PaddleOCR, Tesseract, OpenCV, YOLO, Florence-2-compatible models, SAM 2, MediaPipe, ONNX Runtime Web, axe-core, Web Speech/TTS.  
**Điểm mạnh:** WOW và emotional impact cao nhất; dữ liệu/mô hình phong phú.  
**Điểm yếu:** camera/VLM dễ thất bại live; mọi navigation/safety claim tạo liability. DocWeaver/AccessPatch là lựa chọn thi đấu chắc hơn SceneCompass.

---

## 3. Mobility Impairment

### 3.1 Pain Points & User Journey

| Bối cảnh | Nỗi đau thực tế | Công cụ hiện có | Khoảng trống quyết định |
|---|---|---|---|
| Web/app | Target nhỏ, drag, gesture nhiều ngón, timeout, thiếu keyboard path | Sticky/Slow Keys, Switch/Voice Access | Assistive input không sửa được app thiếu semantic labels/keyboard support |
| Làm việc | Form dài, fatigue/pain/tremor, thao tác chậm, công cụ vẽ/board | Eye control, dictation, alternative keyboard | Calibration, false click, hardware/language coverage, camera conflict |
| Không gian vật lý | Curb, stairs, elevator hỏng làm đứt toàn tuyến | OSM/Wheelmap, transit apps | Data sparse/stale; vật cản tạm thời; nhu cầu wheelchair khác nhau |
| Voice control | Nền ồn, shared office, atypical speech/dysarthria | Voice Access, Vocal Shortcuts | Voice không phải modality phổ quát; privacy và recognition bias |

W3C liệt kê head pointer, mouth stick, switches, speech recognition và eye tracking; người dùng có thể cần nhiều thời gian và gặp khó với target nhỏ. WCAG 2.2 thêm dragging alternative và target tối thiểu 24×24 CSS px, nhưng đạt chuẩn tối thiểu chưa chắc usable. [W3C Physical Barriers](https://www.w3.org/WAI/people-use-web/abilities-barriers/physical/), [WCAG 2.2 New Criteria](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/).

OS đã có Voice Access, Camera Switches và Eye Control, song setup có thể cần trợ giúp/hardware; Windows eye control vẫn liệt kê thiết bị hỗ trợ và keyboard eye-control EN-US, còn Android Camera Switches chiếm camera nên không dùng đồng thời với app camera khác. [Windows Eye Control](https://support.microsoft.com/en-us/accessibility/windows/eye-control/get-started-with-eye-control-in-windows), [Android Camera Switches](https://support.google.com/accessibility/android/answer/11150722?hl=en).

**Gap đáng làm:** một input layer multimodal có calibration, semantic target routing, kill switch và fallback; hoặc UI error shield giảm tremor/misclick mà không thay đổi layout.

### 3.2 Cơ hội công nghệ

- **Camera-only input:** MediaPipe Face/Hand landmarks trong browser; inference on-device, nên chạy Web Worker để không block UI.
- **Semantic routing:** DOM/ARIA cho phép “Send” thay vì click tọa độ; bền hơn RPA pixel-based.
- **Personalized motor model:** PointerEvent + 20–30 giây calibration để học jitter/click offset/dwell; không cần clinical dataset và không suy luận chẩn đoán.
- **Voice/switch fallback:** Web Speech hoặc Whisper nhỏ; một physical key/Bluetooth switch làm activation/kill switch.
- **Sensors/maps:** GPS/OSM/Mapillary có thể làm wheelchair routing, nhưng độ stale và safety liability cao.

### 3.3 Top 3 PoC

#### M1. AccessPilot — hands-free multimodal control

**Value Proposition:** webcam thường trở thành head/face cursor; voice hoặc switch cùng đi qua semantic action router.

```text
Webcam → MediaPipe Face/Gesture trong Web Worker
 → per-user calibration + intent engine
 → DOM/ARIA semantic router
 → dwell click / scroll / undo

Mic hoặc switch → cùng semantic router
IndexedDB → profile local
```

- **Data:** không cần train MVP; calibration mỗi người. MediaPipe cung cấp pretrained landmarks.
- **WOW demo:** calibrate 10 giây; mở và điền form chỉ bằng head movement + dwell; cố ý làm gesture fail rồi đổi sang voice/switch; panel cho thấy video không rời máy.
- **Độ khó:** Trung bình.
- **Live risk:** ánh sáng, permission, drift, false activation, lag.
- **Hardening:** pre-calibrated profile; hold 300–500 ms; Web Worker; kill switch; keyboard/simulated-landmark fallback.

#### M2. SteadyClick — personalized motor error shield

**Value Proposition:** lọc tremor, mở hit-area vô hình, target magnetism và dwell-confirm cho destructive actions mà không reflow trang.

```text
PointerEvent stream
 → Fitts-style calibration
 → One Euro/Kalman filter + click-offset model
 → target magnetism / invisible hit-area / risk confirmation
 → local A/B metrics: time, misclick, undo
```

- **Data:** dữ liệu calibration của chính người dùng; rule/filter đủ cho PoC.
- **WOW demo:** timed target task với tremor simulator; so sánh A/B tức thời; misclick và thời gian giảm; Undo hoàn nguyên mọi can thiệp.
- **Độ khó:** Thấp–Trung bình; stability cao nhất.
- **Live risk:** over-smoothing, canvas/CAD bị ảnh hưởng, extension phá layout.
- **Guardrail:** bypass hotkey; không can thiệp canvas; allowlist domain; invisible hit-area thay vì resize.

#### M3. CurbSense — dynamic wheelchair routing

**Value Proposition:** route theo curb/incline/surface và report vật cản có freshness/confidence.

```text
MapLibre PWA
 → OSM/Overpass snapshot
 → FastAPI + PostGIS/pgRouting
 → user profile edge costs
 → camera/user report + optional on-device CV
 → verified/advisory state + reroute
```

- **Data:** OpenStreetMap tags; ảnh/report tự thu tại khu vực demo.
- **WOW demo:** standard route đi qua curb; wheelchair profile reroute; camera report “blocked curb” làm graph đổi và giải thích đường vòng.
- **Độ khó:** Cao; WOW cao; stability thấp.
- **Live risk:** stale map, GPS drift, network quota, CV sai, safety liability.
- **Hardening:** cache map; fixed GPS replay; seeded graph; CV chỉ advisory; người dùng xác nhận; không claim route an toàn tuyệt đối.

### 3.4 Feasibility & Constraints

**SDK/OSS:** MediaPipe Tasks Vision, ONNX Runtime Web, WebExtension, Pointer Events, Web Speech/Whisper, MapLibre, OSM/Overpass, PostGIS/pgRouting.  
**Chiến lược:** dùng **AccessPilot làm hero**, **SteadyClick làm fallback-stable core**. Tránh phụ thuộc CurbSense nếu đội không có sẵn map/GIS stack.

---

## 4. Neurodivergence

### 4.1 Pain Points & User Journey

Neurodivergence không phải một profile đồng nhất. W3C mô tả cognitive accessibility có thể liên quan perception, memory, language, attention, problem solving và comprehension; WHO nhấn mạnh người tự kỷ là một nhóm rất đa dạng. Vì vậy không được dùng stereotype hay “attention/emotion score”. [W3C Cognitive Accessibility](https://www.w3.org/WAI/cognitive/), [WHO Autism](https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders).

| Bối cảnh | Nỗi đau thực tế | Công cụ hiện có | Khoảng trống quyết định |
|---|---|---|---|
| Đọc/học | Density, jargon, nhiều panel/animation; mất vị trí sau interruption | Reading Mode, Immersive Reader, TTS | Static reading mode thiếu “where was I / what changed / what next” |
| Họp/làm việc | Ghi chú cạnh tranh với nghe; topic switch; action mơ hồ | Transcript, generic summary | Summary không evidence; hallucinated decision/action |
| Lịch/transition | Thay đổi bất ngờ, notification overload, sensory load | Calendar, reminder, visual schedule | Không nói rõ điều gì thay đổi và điều gì giữ nguyên |
| Form/digital service | UI unpredictable, lỗi khó sửa, timeout, task path dài | Reader/focus mode | WCAG 2.x chưa bao phủ hết cognitive barriers; app bên thứ ba giữ thiết kế gốc |
| Personalization | Nhu cầu thay đổi theo người và ngữ cảnh | OS focus settings | One-size-fits-all dễ infantilizing hoặc gây thêm overload |

Android Reading Mode đổi font/contrast/spacing và đọc aloud nhưng không hỗ trợ một số bề mặt như PDF/email/chat/social; Action Blocks đơn giản hóa common actions nhưng chỉ giải quyết một phần workflow. [Android accessibility features](https://support.google.com/accessibility/android/answer/16323943?hl=en), [Action Blocks](https://support.google.com/accessibility/android/answer/9711267?hl=en).

**Gap đáng làm:** một cognitive-continuity layer trả lời ba câu: **Tôi đang ở đâu? Điều gì vừa thay đổi? Bước nhỏ tiếp theo là gì?**

### 4.2 Cơ hội công nghệ

- **Grounded summarization:** rolling transcript/DOM chunks + evidence span/timestamp; schema `now/before/next/confidence` thay vì prose tự do.
- **Deterministic schedule diff:** calendar change được tính bằng rules; LLM chỉ rephrase, không tự suy đoán.
- **Reversible cognitive repair:** DOM/ARIA + COGA heuristics; progressive disclosure mà vẫn giữ original text/state.
- **On-device LLM/ASR:** Transformers.js/ONNX/WebGPU hoặc browser Summarizer API khi đủ hardware; luôn có extractive/rule fallback.
- **Multimodal representation:** cùng nội dung dưới text, speech, pictogram, timeline; người dùng chủ động chọn.
- **Đánh giá:** task completion, error/recovery time, workload và preference; không đo “normality” hay attention score.

COGA là supplemental guidance vượt ngoài WCAG conformance và khuyến nghị user-centred testing với người có lived experience. [W3C COGA Content Usable](https://www.w3.org/TR/coga-usable/introduction.html).

### 4.3 Top 3 PoC

#### N1. FocusRelay — “I lost the thread” meeting companion

**Value Proposition:** khi mất focus, một nút trả về Now / Before / Next, mỗi dòng có timestamp chứng minh.

```text
Mic/WebRTC
 → local Whisper-tiny hoặc cloud ASR fallback
 → rolling topic segmentation + evidence spans
 → structured summarizer
 → React PWA: Now / Before / Next
 → user confirms action before export
```

- **Data:** AMI; QMSum; scripted Vietnamese meeting fixture.
- **WOW demo:** hai người nói và đổi topic; bấm “I lost the thread”; UI hiện chủ đề hiện tại, quyết định trước đó, bước kế tiếp và link transcript; tắt mạng vẫn có extractive recap.
- **Độ khó:** Trung bình.
- **Live risk:** ASR/cold start, hallucinated action, diarization.
- **Hardening:** prewarm; transcript backup; evidence bắt buộc; action không auto-create; extractive fallback.

#### N2. TransitionBridge — schedule change explainer

**Value Proposition:** giải thích rõ `what changed / what stays / next three steps` theo text, icon hoặc speech.

```text
Calendar JSON/manual edit
 → deterministic schedule-diff engine
 → constrained LLM rephrase (optional)
 → visual timeline + TTS + low-stimulation mode
 → local preference: lead time/motion/sound
```

- **Data:** không cần train; fixtures; icon set tự thiết kế hoặc kiểm tra kỹ license.
- **WOW demo:** đổi phòng và lùi 20 phút; app nêu đúng hai thay đổi, những phần giữ nguyên và ba bước; user acknowledge thì hệ thống ngừng nhắc.
- **Độ khó:** Thấp–Trung bình; stability 9/10.
- **Live risk:** notification overload, calendar privacy, LLM diễn giải sai.
- **Guardrail:** rules là source of truth; reminder budget; zero inference về stress; offline templates.

#### N3. Clarity Layer — reversible cognitive-accessibility repair

**Value Proposition:** extension biến form rối thành one-step-at-a-time, plain-language error và progress cues nhưng không mất original/state.

```text
Content script → DOM/ARIA parser
 → COGA/WCAG rule engine
 → dense path/interruption/timeout flags
 → reversible semantic/CSS overlay
 → optional local simplifier
 → original + diff + user approval
```

- **Data:** COGA patterns; ASSET cho simplification evaluation; test form cố ý lỗi.
- **WOW demo:** audit bốn cognitive barriers; Focus View giữ validation; “Explain error” có original cạnh bản dễ hiểu; Undo phục hồi DOM/state.
- **Độ khó:** Trung bình; scalability cao.
- **Live risk:** JS-heavy site, mất nghĩa pháp lý, extension permission, oversimplification.
- **Guardrail:** allowlist; không auto-submit; original luôn hiện; legal/medical text không bị thay thế; meaning-preservation test.

### 4.4 Feasibility & Constraints

**SDK/OSS:** WebExtension, axe-core, React, Workbox, IndexedDB, Transformers.js, ONNX Runtime Web, Whisper, Web Speech, `rrule`.  
**Điểm mạnh:** dễ làm demo ổn định, startup scalability cao, không cần hardware/dataset clinical.  
**Điểm yếu:** WOW thị giác thấp hơn camera/gesture; giá trị chỉ thuyết phục nếu pain point và before/after được diễn kể rất rõ.

---

# Phần 2 — Comparison Matrix

Điểm dưới đây là **ước lượng chiến lược**, không phải kết quả thực nghiệm. Giả định: đội có 3 người, 3 ngày, web/mobile stack, không có hardware chuyên dụng, một hero flow được test kỹ. Tổng là unweighted `/60` đúng sáu tiêu chí người dùng yêu cầu.

| Lĩnh vực | Feasibility | WOW | Social Impact | Data/APIs | Scalability | Live Stability | Tổng /60 | Nhận định |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Deaf / Hard of Hearing | 8.5 | 8.0 | 9.0 | 8.5 | 9.0 | 7.5 | **50.5** | Caption/sound tốt; sign translation làm điểm rơi mạnh |
| Visual Impairment | 8.0 | 9.5 | 10.0 | 9.0 | 9.0 | 7.0 | **52.5** | Cao nhất về impact/WOW; chọn document/browser để ổn định |
| Mobility Impairment | 8.5 | 9.0 | 9.0 | 8.5 | 8.5 | 7.5 | **51.0** | Camera control rất sân khấu; calibration là điểm lỗi |
| Neurodivergence | 9.0 | 7.5 | 9.0 | 7.5 | 9.5 | 9.0 | **51.5** | PoC chắc nhất và dễ mở rộng; cần storytelling tốt |

### Diễn giải nhanh

- **Visual** đứng đầu vì giải quyết workplace artifacts rõ ràng và cho before/after mạnh; live camera kéo stability xuống.
- **Neurodivergence** ổn định nhất vì DOM/text/rule-based fallback không phụ thuộc ánh sáng hay mic.
- **Mobility** là lựa chọn thay thế rất mạnh nếu đội giỏi real-time CV.
- **DHH** khả thi với caption/sound; điểm số không áp dụng cho general sign translation — nhánh đó có feasibility và stability thấp hơn nhiều.

### Chọn PoC theo khẩu vị rủi ro

| Khẩu vị | Hero | Lõi fallback | Tránh |
|---|---|---|---|
| An toàn thắng prelim | DocWeaver hoặc Clarity Layer | fixture offline + deterministic rules | Outdoor navigation, open-domain sign |
| Cân bằng | WorkLens Universal | AccessPatch/Focus View | Cloud-only pipeline |
| All-in WOW | SceneCompass hoặc AccessPilot | prerecorded input / SteadyClick | Claim safety/medical-grade |

---

# Phần 3 — Hai cặp kết hợp chiến lược

## Cặp 1 — Tối ưu feasibility & đồng nhất tech stack

### Visual Impairment + Neurodivergence

**Vì sao chọn**

- Cùng ingest **DOM, PDF, screenshot, document**, không cần hai pipeline sensor hoàn toàn khác.
- Cùng dùng WCAG/ARIA/axe + COGA, OCR/layout và optional LLM/VLM.
- Một output semantic tree có thể phục vụ screen reader/TTS lẫn progressive disclosure/Now–Next.
- Neuro mode tạo live fallback rất chắc; Visual mode nâng impact và WOW.
- Phù hợp trực tiếp chủ đề **AI & Employability**: inaccessible HR portal, payslip, dashboard, onboarding material.

### Nền tảng đề xuất: WorkLens Universal

```text
Workplace portal / PDF / chart
          ↓
DOM + screenshot + OCR/layout extraction
          ↓
Accessibility graph
(headings, controls, reading order, evidence regions)
          ↓
┌─────────────────────┬─────────────────────────┐
│ Vision mode         │ Focus mode              │
│ TTS, ARIA, table,   │ one step, Now/Next,     │
│ long description    │ plain error, low motion │
└─────────────────────┴─────────────────────────┘
          ↓
User feedback + reversible patch + developer export
```

**Kịch bản pitch 3–5 phút**

1. Mở employee onboarding portal cố ý lỗi: unlabeled controls, PDF scan, form nhiều bước.
2. Ở Vision mode, screen reader ban đầu nói “button”; WorkLens tạo provisional label, reading order và semantic table có evidence.
3. Chuyển Focus mode: cùng form thành one-step-at-a-time, chỉ rõ “Now / Next”, error được giải thích nhưng original vẫn hiện.
4. Tắt AI/cloud: deterministic core vẫn hoạt động; nhấn Undo khôi phục trang; export diff cho developer.
5. Kết bằng hai outcome: **independent task completion** và **fix upstream**, không chỉ overlay cá nhân.

**MVP cut line:** chỉ một fixture portal + một PDF/chart; không build crawler, user accounts hay general browsing.

## Cặp 2 — Tối ưu đột phá & hiệu ứng thuyết phục BGK

### Deaf or Hard of Hearing + Visual Impairment

**Vì sao chọn**

- Hai kênh thông tin đối xứng: audio cần biến thành text; visual cần biến thành speech/semantic data.
- Cùng một meeting timeline có thể chứa speech, speaker, non-speech sound, slide region và decision timestamp.
- Demo cho thấy AI không chỉ “caption” hay “describe image”, mà tạo **shared accessible context** cho nhiều nhu cầu.
- Emotional impact cao, rất sát hybrid workplace.

### Nền tảng đề xuất: BridgeRoom

```text
Mic ──→ ASR + diarization + sound events ─┐
Screen share ─→ OCR/VLM + chart grounding ├→ shared evidence timeline
Camera ─→ optional framing/gesture input ─┘
                                          ↓
       captions / TTS descriptions / transcript / action evidence
```

**Kịch bản pitch**

Một cuộc họp KPI 60 giây: DHH mode nhận captions theo speaker và `[door knock]`; Vision mode nghe mô tả chart và câu trả lời “Q3 cao nhất” kèm highlight bar; cuối cùng cả hai hỏi “quyết định là gì?” và nhận timestamp. Nếu VLM không chắc, UI nói “không đủ căn cứ” thay vì bịa.

**Rủi ro:** mic + screen capture + OCR/VLM đều live. Cần prerecorded meeting fixture, prewarm models và đường fallback extractive.

---

# Phần 4 — Dự thảo trả lời form ADC Hackathon 2026

Hai câu dưới đây dùng cặp khuyến nghị chính **Visual Impairment + Neurodivergence**. Đã kiểm đếm bằng tách token theo khoảng trắng; ngay cả khi bộ đếm tách từ ghép có dấu gạch nối, vẫn nằm trong giới hạn.

## Q1. Why does your team want to join ADC Hackathon 2026?

**115 words**

> Our team wants to join ADC Hackathon 2026 because accessibility should be a foundation of work, not an accommodation added after exclusion occurs. We are motivated to build an AI-powered workplace companion for blind, low-vision, and neurodivergent professionals that transforms inaccessible documents and interfaces into structured, multimodal, user-controlled experiences. The challenge matches our strengths in full-stack engineering, multimodal AI, and responsible product design, while pushing us to work directly with lived experience rather than assumptions. We want to prove that ambitious technology can also be practical, privacy-aware, and inclusive by default. Most importantly, we hope to turn three intense days of collaboration into a credible prototype that expands independence, confidence, and equitable participation at work.

## Q2. What does your team hope to learn or gain from this hackathon?

**97 words**

> We hope to strengthen our ability to move from user research to a resilient end-to-end system under real constraints. Through mentoring and testing with people with lived experience, we want to validate our assumptions, measure usability, and learn where AI should assist, abstain, or defer to the user. We also aim to improve our system architecture, including on-device inference, accessible interaction patterns, graceful fallbacks, privacy safeguards, and live-demo reliability. Beyond technical skills, we want to develop a deeper Universal Design mindset that helps us create products flexible enough to serve diverse needs without segregating or stigmatizing users.

---

# Kế hoạch thực thi 3 ngày đề xuất

| Thời điểm | Mục tiêu | Definition of Done |
|---|---|---|
| Trước hackathon | fixture portal/PDF; pipeline skeleton; user interview guide; licenses/models cached | demo chạy offline với rules; source/data attribution sẵn |
| Day 1 — Learn & Frame | xác nhận một high-value task với end-user; cắt scope | problem statement 1 câu; success metric; storyboard 5 bước |
| Day 2 sáng | deterministic core + accessible UI | keyboard/screen-reader path; Undo; fallback fixture |
| Day 2 chiều | thêm một AI moment có evidence/confidence | AI failure không chặn task; data retention off mặc định |
| Day 3 sáng | rehearse, latency budget, video backup | ba lần demo liên tiếp; cold/warm run; deck/video <5 phút |
| Finale | kể before → barrier → co-designed fix → measured outcome | không nói thay người dùng; không overclaim safety/diagnosis |

### Acceptance tests tối thiểu

- Keyboard-only và screen-reader smoke test; focus order rõ; target size hợp lý; captions/text có contrast.
- AI output luôn có confidence/evidence hoặc trạng thái “không chắc”.
- Cloud fail vẫn có deterministic/extractive fallback.
- Raw mic/camera/document không được lưu mặc định; có consent, Delete và retention statement.
- Không infer disability, diagnosis, emotion hay productivity từ clickstream/gaze/voice.
- Co-design hoặc ít nhất concept validation với người có lived experience; ghi rõ limitation nếu chưa làm được.

## Giới hạn nghiên cứu

- Chưa có interview trực tiếp với người dùng tại Việt Nam; insight cần được xác nhận trong fireside chat/user testing của ADC.
- Chưa biết stack, GPU, ngân sách API và kỹ năng từng thành viên; scoring giả định đội web/mobile full-stack tổng quát.
- Availability và license của model/dataset phải được re-check khi tải; VSL400 cần controlled access và không nên là critical path.
- Điểm số là decision aid cho hackathon, không phải xếp hạng giá trị của các cộng đồng hay nhu cầu accessibility.

