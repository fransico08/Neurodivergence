# ADC Hackathon 2026 — Briefing Synthesis & Applied Development Plan

**Nhóm lĩnh vực:** Deaf or Hard of Hearing (DHH) + Neurodivergence  
**Ngày cập nhật:** 18/09/2026  
**Sự kiện:** 21–23/09/2026, RMIT University Vietnam — Saigon South Campus  
**Nguồn chính:** [ADC Hackathon 2026 Online Briefing, 18/09/2026](https://youtu.be/AhTFiT9bqzI) và [website chính thức ADC](https://industryhub.rmit.edu.vn/ADC/)  
**Tài liệu nền của nhóm:** [Deep Research DHH + Neurodivergence](./ADC_Hackathon_2026_DHH_Neurodivergence_Deep_Research.md)

> **Khuyến nghị điều hành:** Tiếp tục phát triển hướng **SignalFlow — meeting continuity assistant** nhưng chỉ coi đây là một “solution kernel” chuẩn bị trước. Đến khi competition brief được công bố sáng Day 1, nhóm phải khóa lại **một barrier cụ thể trong một employment stage**, rồi điều chỉnh sản phẩm theo dữ liệu từ end-user. PoC thắng điểm không cần nhiều model; nó cần một user journey rõ, prototype ổn định, AI có bằng chứng và nội dung nộp đúng template trước 07:00 ngày 23/09.

---

# 1. Phạm vi và phương pháp tổng hợp

## 1.1 Tài liệu này trả lời bốn câu hỏi

1. Ban tổ chức đã xác nhận những quy định, mốc thời gian và deliverable nào?
2. Những điểm nào ảnh hưởng trực tiếp đến chiến lược của nhóm DHH + Neurodivergence?
3. Với nghiên cứu, model và dataset đã có, nhóm nên xây gì trong dưới 48 giờ?
4. Nhóm cần chuẩn bị gì trước, trong và sau từng phiên làm việc để tối đa hóa điểm số?

## 1.2 Mức tin cậy

- **Confirmed:** được ban tổ chức nói rõ trong briefing và/hoặc khớp website chính thức.
- **Working interpretation:** suy luận triển khai của báo cáo, không phải điều lệ chính thức.
- **Pending Day 1:** phụ thuộc competition brief hoặc template chưa công khai trong video.

Transcript của YouTube là auto-generated English nên có lỗi tên riêng và một số câu ngắt. Báo cáo chỉ giữ các thông tin được nói rõ, lặp lại hoặc đối chiếu được. Ví dụ, người trình bày có lúc nói nhầm “Day 2” rồi sửa ngay thành **Day 3, Wednesday 23 September, 07:00**; mốc được xác nhận lại ở phần submission và khớp lịch sự kiện.

---

# 2. Executive Summary — những gì nhóm phải nhớ

## 2.1 Mười quy tắc có ảnh hưởng trực tiếp

| # | Quy định/Thông tin | Trạng thái | Hành động của nhóm |
|---:|---|---|---|
| 1 | Không được đổi disability focus area hoặc thành viên sau đăng ký | Confirmed | Giữ DHH + Neurodivergence; kiểm tra đúng danh sách và giấy tờ |
| 2 | Cả ba thành viên phải tham dự các phiên bắt buộc trực tiếp; attendance ảnh hưởng eligibility vào finale | Confirmed | Chia workshop song song nhưng không bỏ phiên; xin phép bằng email nếu có tình huống bắt buộc |
| 3 | Competition brief chỉ công bố sáng Day 1 và mô tả barrier qua sáu employment stages | Confirmed | Không khóa problem statement cuối cùng trước khi đọc brief |
| 4 | Final submission gồm **PPTX theo template** và **video MP4/MOV dưới 5 phút**, bằng English | Confirmed | Chuẩn bị nội dung modular; không dựng deck tự do |
| 5 | Hạn nộp **07:00, Wednesday 23/09/2026**; không nhận trễ và BTC không chịu trách nhiệm lỗi upload/file | Confirmed | Internal deadline 05:30; upload và tải lại để kiểm tra |
| 6 | Template có sáu slide chính phải giữ số lượng/thứ tự; thông tin thêm vào appendix | Confirmed qua Q&A | Map nội dung theo placeholder; không thêm slide chính tùy ý |
| 7 | Video phải để slide nhìn rõ, landscape, audio dễ hiểu; nên có đóng góp của các thành viên | Confirmed | Caption video, mic tốt, script chia vai; không dùng AI avatar thay người trình bày |
| 8 | Prototype được yêu cầu nhưng hardware/coding không bắt buộc | Confirmed | PoC web tương tác là đủ; không đốt thời gian vào thiết bị |
| 9 | AI có thể dùng toàn phần hoặc một phần, trong development hoặc product, nhưng phải giải thích rõ và dùng phù hợp/có trách nhiệm | Confirmed | Thể hiện AI role, guardrail, failure mode và fallback trong deck/demo |
| 10 | Top 8 pitch trực tiếp: **10 phút gồm demo + 5 phút Q&A**, dùng đúng deck đã nộp, không thay/add slide sau submission | Confirmed | Thiết kế deck dùng được cho cả video <5 phút và live pitch 10 phút |

Các mốc trên xuất hiện trong phần journey/submission/rules và Q&A của briefing: [journey](https://youtu.be/AhTFiT9bqzI?t=342), [submission](https://youtu.be/AhTFiT9bqzI?t=821), [rules](https://youtu.be/AhTFiT9bqzI?t=1273), [finale timing](https://youtu.be/AhTFiT9bqzI?t=2670), [template lock](https://youtu.be/AhTFiT9bqzI?t=3240).

## 2.2 Kết luận chiến lược cho đề tài hiện tại

SignalFlow vẫn phù hợp vì:

- trực tiếp giải quyết workplace/hybrid-work accessibility;
- kết nối tự nhiên hai focus area mà không trộn họ thành một persona;
- có thể trình diễn bằng web prototype trong thời gian ngắn;
- AI có nhiệm vụ rõ: ASR và recap được grounded vào timestamp;
- dễ chứng minh responsible AI bằng transcript bất biến, uncertainty và user confirmation.

Nhưng hướng hiện tại phải điều chỉnh theo ba nguyên tắc:

1. **Problem first:** chưa khẳng định “meeting” là đề bài cuối cho đến khi đọc competition brief.
2. **Prototype before model complexity:** một flow end-to-end ổn định có giá trị hơn ASR/diarization rất tham vọng.
3. **Evidence before claim:** mỗi quyết định/action do AI sinh phải mở được câu gốc và timestamp.

---

# 3. Nội dung briefing được chuẩn hóa

## 3.1 Bối cảnh cuộc thi

- ADC 2026 là mùa thứ sáu, chuyển từ chương trình kéo dài khoảng hai tháng sang hackathon ba ngày.
- Hơn 60 đội, tương đương hơn 180 người tham dự; chọn 8 đội vào Grand Finale.
- Mục tiêu là thiết kế giải pháp có AI nhằm cải thiện accessibility và inclusion tại nơi làm việc.
- Bốn focus areas: Visual Impairment, Deaf or Hard of Hearing, Mobility Impairment và Neurodivergence.

Nguồn: [briefing 04:34–05:36](https://youtu.be/AhTFiT9bqzI?t=274); [ADC official page](https://industryhub.rmit.edu.vn/ADC/).

## 3.2 Participant journey

### Day 1 — Learn & Frame, Monday 21/09

| Giờ | Hoạt động | Ý nghĩa chiến lược |
|---|---|---|
| 07:30–09:00 | Check-in/networking | Check-in theo cả đội; nhận badge, áo và thông tin |
| 09:00–10:00 | Opening + release competition brief | Đây mới là lúc khóa problem statement/employment stage |
| 10:00–11:15 | Workshop bắt buộc: Accessibility & Universal Design | Ghi lại language/criteria dùng trong deck |
| 11:20–12:20 | Hai workshop song song: AI Tools và Design Thinking | Chia thành viên, sau đó teach-back trong nhóm |
| Sau 12:20 | Teamwork | Frame user/problem, dựng prototype và chuẩn bị câu hỏi Day 2 |
| 13:00–15:00 | Đăng ký mock pitch Day 2 nếu muốn | Chỉ 20 slots, first come first served; confirmation khoảng 17:00 |

Nguồn: [briefing 07:40–09:31](https://youtu.be/AhTFiT9bqzI?t=460), [mock pitch registration](https://youtu.be/AhTFiT9bqzI?t=638).

### Day 2 — Test & Refine, Tuesday 22/09

| Giờ | Hoạt động | Deliverable nội bộ nên có |
|---|---|---|
| 08:00–09:00 | Check-in | Ba thành viên có mặt, badge/ID đầy đủ |
| 09:00–10:00 | Fireside chat với end-users theo focus area | 5–8 insight có provenance; 2 thay đổi sản phẩm được ghi lại |
| 10:15–11:45 | Express mentoring + technical consultation | Xác nhận feasibility, stakeholder, cost, rủi ro kỹ thuật |
| Chiều | Teamwork/refinement | Hero flow hoạt động; deck draft; video script |
| 15:00–17:00 | Mock pitching, nếu đăng ký thành công | Nhận feedback về cả idea/product và presentation; không ảnh hưởng kết quả finalist |

Nguồn: [briefing 09:34–11:05](https://youtu.be/AhTFiT9bqzI?t=574), [mock-pitch scope](https://youtu.be/AhTFiT9bqzI?t=2343), [mock pitch không ảnh hưởng finalist](https://youtu.be/AhTFiT9bqzI?t=3053).

### Day 3 — Evaluate & Pitch, Wednesday 23/09

| Giờ | Hoạt động | Lưu ý |
|---|---|---|
| **07:00** | Final submission deadline | Submission link riêng được phát Day 1; không nộp trễ |
| Sáng | Online evaluation; team không bắt buộc ở campus | Theo dõi email thường xuyên |
| 12:00–13:30 | Finale check-in/networking | Tất cả đội nên có mặt để nghe kết quả |
| 13:40–13:50 | Công bố Top 8 | Attendance của các phiên bắt buộc được kiểm tra |
| 14:00–16:00 | Top 8 live pitches | 10 phút/pitch gồm demo, sau đó 5 phút Q&A |
| 16:15–17:00 | Closing/awards | — |

Nguồn: [Day 3 agenda](https://youtu.be/AhTFiT9bqzI?t=670), [live-pitch timing](https://youtu.be/AhTFiT9bqzI?t=2670).

## 3.3 Submission package

### A. Solution Pitch Deck

- Dùng **official template** do BTC cung cấp.
- Sáu slide chính phải giữ số lượng và thứ tự theo hướng dẫn template.
- Có thể đổi font size và thêm visual elements, nhưng không đổi sequence.
- Dùng appendix cho architecture, calculation, prototype link, evidence hoặc chi tiết bổ sung.
- Ngôn ngữ: English.
- Chỉ nhận `.pptx`; không nhận PDF, Google Slides hoặc Canva link.
- Quy tắc tên file: `Team Name_Project Title` theo hướng dẫn BTC.
- Deck đã submit cũng là deck dùng ở Grand Finale; không thay/add slide sau submission.

Nguồn: [deck requirements](https://youtu.be/AhTFiT9bqzI?t=830), [font/visual Q&A](https://youtu.be/AhTFiT9bqzI?t=3556), [deck bị khóa sau submission](https://youtu.be/AhTFiT9bqzI?t=3614).

### B. Solution Video

- Thời lượng **dưới 5 phút**, không phải đúng 5 phút.
- Trình bày và giải thích slide; slide phải nhìn rõ xuyên suốt.
- Ngôn ngữ: English.
- Landscape; `.mp4` hoặc `.mov`.
- Audio rõ và dễ hiểu; video/deck phải accessible với evaluator.
- Khuyến khích các thành viên cùng đóng góp.
- Nội dung cần đủ trước khi đầu tư hiệu ứng sáng tạo.
- Q&A cho biết không nên dùng phần trình bày/video do AI tạo thay con người; thành viên nhóm cần trực tiếp trình bày ý tưởng.

Nguồn: [video requirements](https://youtu.be/AhTFiT9bqzI?t=920), [AI-generated video Q&A](https://youtu.be/AhTFiT9bqzI?t=3325), [clarity trước creativity](https://youtu.be/AhTFiT9bqzI?t=3366).

### C. Submission reliability

- Nhóm chịu trách nhiệm về tính đầy đủ, accessibility và upload thành công.
- Không nhận late submission.
- BTC không chịu trách nhiệm nếu file hỏng, upload lỗi hoặc participant gặp technical issue.
- Submission link riêng được gửi Day 1.

**Quy trình nội bộ đề xuất:**

```text
04:45  Freeze PPTX + video
05:00  Kiểm tra mở file trên máy thứ hai
05:15  Upload
05:30  Tải lại file đã upload và mở kiểm tra
05:45  Chụp bằng chứng/timestamp submission
06:00  Buffer xử lý lỗi
07:00  Official deadline — tuyệt đối không dùng làm giờ upload mục tiêu
```

## 3.4 Competition rules và attendance

- Không đổi disability focus-area assignment hoặc thành viên sau đăng ký.
- Xác minh danh tính bằng student ID, national ID hoặc passport.
- Tất cả thành viên tham dự các phiên bắt buộc trong ba ngày; attendance có thể được dùng để xác định eligibility vào finale.
- Nếu có tình huống không thể tham dự, gửi email đến địa chỉ đã nhận shortlist, ghi team name, member và bằng chứng; BTC xét từng trường hợp.
- Team có thể làm việc ngoài campus sau các phiên bắt buộc, nhưng phải trở lại đúng lịch đã đăng ký.
- Không cần hardware prototype; trong điều kiện dưới 48 giờ, digital/AI-assisted prototype được chấp nhận.
- Coding/technical background không bắt buộc.

Nguồn: [competition rules](https://youtu.be/AhTFiT9bqzI?t=1273), [attendance eligibility](https://youtu.be/AhTFiT9bqzI?t=2829), [hardware not required](https://youtu.be/AhTFiT9bqzI?t=2636), [coding not required](https://youtu.be/AhTFiT9bqzI?t=2726).

## 3.5 Judging criteria

| Criterion | Câu hỏi giám khảo thực sự đặt ra | Evidence nhóm phải cung cấp |
|---|---|---|
| Innovation & Impact | Có giải quyết barrier thật và khác baseline hiện có không? | Competitive gap; before/after user journey; outcome metric |
| User-Centred Design & Accessibility | Có hiểu người dùng và áp dụng inclusive design không? | Insight từ end-user; change log; accessibility checks |
| Feasibility & Practicality | Có xây/triển khai được với nguồn lực thực tế không? | Working prototype; cost class; deployment/fallback; roadmap pilot |
| Use of AI | AI có hiệu quả, phù hợp và responsible không? | Role của model; data flow; uncertainty; evidence; privacy; fallback |
| Presentation & Communication — finale only | Có truyền đạt rõ, thuyết phục và trả lời tốt không? | Narrative thống nhất; demo rehearsed; Q&A ownership |

Nguồn: [judging criteria trong briefing](https://youtu.be/AhTFiT9bqzI?t=1404), [official judging criteria](https://industryhub.rmit.edu.vn/ADC/#judging).

### Điều không cần ưu tiên

BTC nói **không yêu cầu detailed business model, go-to-market hoặc marketing strategy**. Nếu còn thời gian, đưa estimated cost, stakeholder/adoption, feasibility và prototype-to-pilot roadmap vào appendix. Không để business plan chiếm thời gian khỏi bốn tiêu chí vòng evaluation. [Q&A 40:43–42:13](https://youtu.be/AhTFiT9bqzI?t=2443).

---

# 4. Áp dụng vào đề tài DHH + Neurodivergence

## 4.1 Solution kernel đề xuất

### SignalFlow — One conversation, many accessible views

```text
Meeting audio / controlled recorded fixture
                    ↓
        ASR + timestamp + uncertainty
                    ↓
     Append-only verbatim evidence timeline
             ┌──────┼────────┐
             ↓      ↓        ↓
         DHH View  Focus   Combined View
             │      │        │
             └──────┴────────┘
                    ↓
 “I lost the thread” → NOW / BEFORE / NEXT
                    ↓
      Exact source quote + timestamp + confirm
```

### Barrier hypothesis

Trong một cuộc họp hoặc training nhanh:

- người DHH có thể thiếu lời nói, speaker identity, tên riêng hoặc meaningful sound context;
- người neurodivergent có thể gặp split attention, sensory/cognitive overload hoặc mất mạch sau interruption;
- caption đầy đủ giúp người này nhưng có thể làm người khác quá tải;
- vì vậy, một evidence layer chung phải cho phép **user-controlled views**, không tự gắn nhãn người dùng.

### Problem statement tạm thời

> How might we help Deaf, hard-of-hearing and neurodivergent employees follow and recover fast-moving workplace communication without forcing everyone into the same information density or asking them to trust an opaque AI summary?

**Pending Day 1:** thay `workplace communication` bằng barrier và employment stage chính xác trong brief.

## 4.2 Cách thích ứng ngay khi brief được phát

Không biết trước tên chính thức của sáu employment stages, nên dùng decision procedure thay vì đoán:

```text
Đọc toàn bộ brief
  ↓
Lọc các barrier thuộc DHH + Neurodivergence
  ↓
Chấm mỗi barrier theo: severity × frequency × prototype fit × user access
  ↓
Chọn đúng 1 primary barrier + 1 primary employment stage
  ↓
Viết lại hero scenario trong 1 câu
  ↓
Giữ/bỏ component của SignalFlow theo scenario
```

### Adaptation matrix minh họa — không phải taxonomy chính thức của brief

| Nếu brief nhấn mạnh… | SignalFlow biến thành… | Feature được giữ | Feature nên bỏ |
|---|---|---|---|
| Recruitment/interview | Accessible Interview Companion | captions, correction, catch-up, question state | sound alerts, broad meeting analytics |
| Onboarding/training | Adaptive Training Caption Player | caption density, glossary, transcript search, recap | live diarization |
| Daily collaboration | Meeting Continuity Companion | full core flow | VSL translation, emotion inference |
| Performance conversation | Evidence-linked Clarification Aid | exact quote, uncertainty, user notes | automatic sentiment/performance scoring |
| Learning/career development | Accessible Learning Recap | paced caption, timestamps, Now/Before/Next | speaker complexity nếu không cần |
| Job transition/retention | Handover Continuity Layer | decision/action evidence, low-stimulation mode | nonessential live audio features |

## 4.3 MVP / Stretch / Cut

| Priority | Scope |
|---|---|
| **MUST** | One 60–90s Vietnamese fixture; timestamped verbatim transcript; DHH/Focus switch; “I lost the thread”; 1–3 evidence-linked recap bullets; original text always available; keyboard path; deterministic fallback |
| **SHOULD** | Correction + 20-term glossary; live mic secondary path; simple manual/known speaker labels; model uncertainty |
| **COULD** | Local ASR; optional structured LLM recap; downloadable accessible transcript |
| **CUT FIRST** | Live diarization, broad YAMNet sound classification, continuous VSL, emotion/attention detection, automated task/email creation |

## 4.4 Vì sao scope này khớp điều lệ

| Requirement | Design response |
|---|---|
| Prototype trong dưới 48 giờ | PWA/web demo; fixture deterministic; local JSON store |
| Workplace accessibility | Một task cụ thể trong meeting/training/interview |
| User-centred | Hai views do user chọn; thay đổi theo feedback Day 2 |
| Meaningful AI | ASR + evidence-bound recap, không phải AI trang trí |
| Responsible AI | Transcript bất biến; confidence; abstention; consent; ephemeral data |
| Feasibility | Không hardware; không train model; fallback không phụ thuộc network |
| Accessible submission | Caption video; readable slide; clear narration; transcript/alt text trong appendix nếu phù hợp |

---

# 5. Data & Model Development Plan

## 5.1 Không train model trong hackathon

Trong thời gian thực tế dưới 48 giờ, fine-tuning sẽ tiêu tốn thời gian nhưng ít tăng điểm nếu user journey chưa chắc. Dataset nên phục vụ ba việc:

1. benchmark model có sẵn;
2. tạo demo ổn định, tái lập;
3. chứng minh output có evidence và đo được.

## 5.2 Bộ dữ liệu tối thiểu nhóm tự tạo

### `signalflow_demo_v1`

| File | Nội dung | Mục đích |
|---|---|---|
| `meeting_clean.wav` | 60–90 giây, 2 thành viên, có consent | Golden demo |
| `meeting_noise.wav` | Cùng script với office noise nhẹ | Robustness check |
| `meeting_overlap.wav` | 1–2 đoạn nói chồng có kiểm soát | Failure-mode demonstration |
| `gold_transcript.jsonl` | Utterance, speaker, start/end, exact text | ASR/evidence evaluation |
| `keywords.csv` | 20 tên riêng, acronym, deadline, technical terms | Key-term accuracy |
| `events.json` | Topic, decision, action, unresolved, evidenceIds | Recap validation |
| `preferences.json` | Display settings, không chứa diagnosis | Renderer test |

### Schema đề xuất

```json
{
  "utteranceId": "u-014",
  "speakerId": "speaker-b",
  "startMs": 38200,
  "endMs": 42700,
  "verbatimText": "Linh gửi bản thử nghiệm trước 16 giờ thứ Sáu.",
  "keywords": ["Linh", "16 giờ", "thứ Sáu"],
  "labels": ["action", "deadline"],
  "consent": true
}
```

### Data ethics

- Chỉ thu âm thành viên đã đồng ý; không ghi âm end-user/mentor/campus member nếu chưa có explicit consent.
- Không gắn disability diagnosis vào dữ liệu.
- Không dùng voice/facial features để suy đoán emotion, attention hoặc productivity.
- Raw audio xóa hoặc giữ cục bộ theo thỏa thuận nội bộ; submission chỉ chứa asset cần thiết.
- Nếu quay người khác trong campus, briefing yêu cầu explicit verbal/written consent. [Campus media consent](https://youtu.be/AhTFiT9bqzI?t=2180).

## 5.3 Model/dataset có sẵn và vai trò đúng

| Asset | Vai trò | Nên dùng thế nào | Không nên làm |
|---|---|---|---|
| PhoASR-whisper-small | ASR tiếng Việt 2026 candidate | Benchmark trên laptop và fixture | Mặc định coi là tốt nhất trước khi đo |
| PhoWhisper-base/small | ASR Việt ngữ dễ tích hợp | Baseline/fallback | Fine-tune trong hackathon |
| Whisper/faster-whisper | Runtime/baseline phổ biến | Dùng nếu ổn định hơn trên máy | Hứa realtime trên mọi hardware |
| Common Voice Vietnamese | Speech smoke test | Thử accent/generalization trên vài sample hợp lệ | Dùng thay meeting fixture |
| AMI Meeting Corpus | Meeting/speaker pipeline reference | Test logic turn/timestamp ngoài tiếng Việt | Claim đại diện workplace Việt Nam |
| QMSum | Meeting recap reference | Tham khảo schema/query-summary | Train trong 48 giờ |
| VSL400 | Future VSL research | Nêu trong roadmap nếu brief phù hợp | Continuous VSL translator; dataset access là critical path |
| YAMNet | Optional non-speech event | Chỉ 1–3 allowlisted sounds nếu có thời gian | Emergency detector hoặc show 521 class |

Nguồn kỹ thuật: [PhoASR model card](https://huggingface.co/Qualcomm-AI-Research/PhoASR-whisper-small), [PhoWhisper](https://huggingface.co/vinai/PhoWhisper-base), [Whisper](https://github.com/openai/whisper), [Common Voice](https://commonvoice.mozilla.org/en/datasets), [AMI Corpus](https://groups.inf.ed.ac.uk/ami/corpus/), [QMSum](https://aclanthology.org/2021.naacl-main.472/), [VSL400](https://zenodo.org/records/17943574), [YAMNet](https://www.tensorflow.org/hub/tutorials/yamnet).

## 5.4 Model-selection gate

Benchmark mỗi ASR candidate trên cùng ba audio fixtures. Chọn theo composite score:

```text
Score = 0.40 × key-term accuracy
      + 0.25 × transcript accuracy
      + 0.20 × latency score
      + 0.15 × operational stability
```

Acceptance targets cho PoC — đây là target nội bộ, không phải chuẩn cuộc thi:

- key-term accuracy ≥ 90% trên clean fixture;
- median final-caption latency ≤ 2 giây nếu live;
- 100% recap factual fields có `evidenceIds`;
- 3/3 demo runs không cần restart;
- nếu không đạt, dùng prepared transcript/live-like playback minh bạch thay vì giả vờ live.

## 5.5 Kiến trúc nên xây

```text
Next.js/React PWA
  ├── Fixture player / microphone adapter
  ├── DHH / Focus / Combined renderer
  ├── Keyboard + reduced-motion + caption controls
  └── Demo telemetry
             │
             ▼
FastAPI/WebSocket orchestrator
  ├── VAD
  ├── ASR adapter (PhoASR/PhoWhisper/Whisper)
  ├── correction + glossary
  └── extractive recap fallback
             │
             ▼
Append-only evidence store
  └── utteranceId, speaker, timestamps, verbatim, confidence
             │
             ▼
Optional grounded LLM
  └── strict JSON: now/before/next/evidenceIds/confidence
```

**Architecture invariant:** Caption rendering không được chờ LLM. LLM lỗi hoặc mất mạng thì transcript, mode switch và extractive recap vẫn chạy.

---

# 6. User Research Plan cho Day 2

## 6.1 Mục tiêu

Không hỏi end-user “Bạn có thích ý tưởng này không?”. Hỏi về workflow thật, failure cost và preference conflict.

## 6.2 Câu hỏi cho DHH end-user

1. Trong employment stage của brief, khoảnh khắc nào làm bạn bỏ lỡ thông tin quan trọng nhất?
2. ASR sai loại từ nào gây hậu quả lớn: tên người, số, deadline, jargon hay speaker?
3. Bạn cần verbatim caption, edited caption hay cả hai trong từng bối cảnh?
4. Confidence/uncertainty nên hiển thị thế nào để hữu ích mà không gây nhiễu?
5. Khi nào công cụ này không đủ và cần interpreter/CART/human support?

## 6.3 Câu hỏi cho neurodivergent end-user

1. Nguồn overload chính là audio, caption, chat, video faces, slide, notification hay ambiguity?
2. Khi mất mạch, thông tin tối thiểu nào giúp quay lại task?
3. Auto-scroll/highlighting giúp hay gây distraction?
4. Now/Before/Next nên chứa tối đa bao nhiêu dòng?
5. Điều gì khiến plain-language summary mất nuance hoặc mang giọng infantilizing?

## 6.4 Câu hỏi giao thoa

- Khi nào caption đầy đủ hỗ trợ, khi nào làm split attention nặng hơn?
- Người dùng muốn tự đổi mode hay hệ thống đề xuất mode?
- Evidence/timestamp có đủ để tin recap không?
- Setting nào phải lưu, setting nào nên reset mỗi session?

## 6.5 Evidence log

Mỗi insight ghi theo cấu trúc:

| Field | Ví dụ |
|---|---|
| Observation | User phải nhìn slide và caption ở hai vị trí |
| Source | DHH fireside participant, session 22/09; không ghi tên nếu chưa consent |
| Confidence | 1 participant; cần validation thêm |
| Design response | Combined View đặt recap dưới caption; không side panel |
| Prototype change | `layout=stacked`; giảm auto-scroll |
| Validation | Test lại với participant/mentor |

Đây là bằng chứng User-Centred Design tốt hơn một persona tưởng tượng.

---

# 7. Prototype & Demo Specification

## 7.1 Hero flow dưới 90 giây

1. Hai người trao đổi bằng tiếng Việt về một deadline; có một tên riêng và câu mơ hồ.
2. DHH View hiện verbatim caption, speaker/source và highlight từ không chắc.
3. User sửa tên riêng; glossary cập nhật.
4. User chuyển Focus View và bấm **“I lost the thread.”**
5. UI trả `NOW / BEFORE / NEXT`, mỗi dòng có timestamp.
6. Với deadline mơ hồ, hệ thống nói “Not enough evidence” thay vì bịa.
7. Mở exact quote để chứng minh traceability.

## 7.2 Demo reliability ladder

| Level | Input | AI | Khi dùng |
|---|---|---|---|
| A — Primary | Prerecorded audio được stream qua pipeline thật | Local/cloud ASR + grounded recap | Video submission và finale nếu ổn định |
| B — Secondary | Live microphone | Cùng pipeline | Chỉ khi 3/3 rehearsal pass |
| C — Fallback | Timestamped event fixture | Extractive rules | Mất mạng/model lỗi |

Nói minh bạch input nào đang chạy. “Prerecorded input through a live pipeline” vẫn là demo thật; không nên giả nó là microphone live.

## 7.3 Acceptance tests

- Keyboard-only hoàn thành `View switch → Catch up → Evidence`.
- Không dùng màu làm tín hiệu duy nhất; speaker có text/shape.
- Caption không che vùng mặt/lip-reading trong layout demo.
- Reduced motion hoạt động; auto-scroll tắt được.
- Original transcript không bị AI ghi đè.
- Mỗi decision/action mở đúng exact quote/timestamp.
- Không factual recap khi evidence thiếu.
- Network fail không làm mất core flow.
- Video có captions, clear narration và readable slides.

---

# 8. Nội dung cho sáu slide chính

Tên slide thực tế phải theo template được BTC cung cấp; bảng dưới đây chỉ là **content mapping**, không được dùng để đổi title/order chính thức.

| Content block | Nội dung cốt lõi | Visual nên dùng | Criterion |
|---|---|---|---|
| Identity/one-liner | SignalFlow + một câu value proposition | Product frame đơn giản | Communication |
| Problem/user | Một barrier, một employment stage, DHH vs Neuro tension | Before journey + end-user evidence | Impact, UCD |
| Insight/gap | Caption baseline chưa giải quyết continuity/control | Current tools vs unmet need | Innovation |
| Solution/prototype | One evidence timeline, three user-controlled views | Architecture + 3 UI frames | Innovation, AI |
| Validation/impact | End-user change log + metrics | Before/after + scorecard | UCD, Impact |
| Feasibility/responsible AI | Scope, cost class, fallback, privacy, roadmap | MVP/Stretch/Cut + risk control | Feasibility, AI |

### Appendix nên chuẩn bị

- architecture/data flow;
- dataset/model/license table;
- benchmark results;
- end-user evidence/change log;
- cost/deployment estimate;
- prototype URL/QR nếu template cho phép;
- risk register và future roadmap;
- references.

---

# 9. Video dưới 5 phút — recommended structure

| Thời gian | Nội dung | Speaker |
|---:|---|---|
| 00:00–00:25 | Hook: workplace conversation disappears | Member 1 |
| 00:25–00:55 | User barrier + DHH/Neuro tension + end-user evidence | Member 1 |
| 00:55–02:35 | Hero demo: caption → correction → catch-up → exact evidence | Member 2 |
| 02:35–03:20 | Architecture và vai trò thật của AI | Member 3 |
| 03:20–04:05 | Validation, metric và change made after Day 2 | Member 1 |
| 04:05–04:40 | Feasibility, privacy, fallback, roadmap | Member 3 |
| 04:40–04:55 | One-sentence close | Cả nhóm hoặc Member 1 |

### Production checklist

- 1920×1080 landscape, MP4 nếu thuận tiện.
- Deck chiếm phần lớn khung hình; con trỏ to, không rê vô nghĩa.
- Narration tiếng Anh chậm, rõ; không nhạc nền hoặc nhạc rất nhỏ.
- Burned-in English captions hoặc caption track được kiểm tra thủ công.
- Font lớn; contrast tốt; không nhồi appendix vào video.
- Xuất bản nháp sớm; kiểm tra trên máy khác.
- Tên file đúng convention của BTC.

---

# 10. Kế hoạch hành động 18–23/09

## 18/09 — Sau briefing

- [ ] Kiểm tra recap email, pre-event survey, campus guide, submission template và Zalo group.
- [ ] Xác nhận focus-area assignment và ba thành viên.
- [ ] Chuẩn bị ID; thống nhất phương tiện/check-in theo nhóm.
- [ ] Cache dependencies/model; tạo repo/folder structure.
- [ ] Thu `meeting_clean.wav` có consent; tạo gold transcript và 20 keywords.
- [ ] Viết 10 câu hỏi end-user/mentor.

## 19/09 — Technical readiness

- [ ] Benchmark PhoASR/PhoWhisper/Whisper trên máy demo.
- [ ] Chọn primary model + fallback bằng số đo.
- [ ] Xây evidence schema và fixture playback.
- [ ] Xây DHH/Focus renderer bằng fake events trước.
- [ ] Chuẩn bị offline assets, local fonts và icon license.

## 20/09 — Rehearsal before brief

- [ ] Core flow chạy được dù problem statement còn placeholder.
- [ ] Accessible design tokens, keyboard path, reduced motion.
- [ ] Chuẩn bị decision matrix để chọn barrier trong 30–45 phút.
- [ ] Phân workshop AI vs Design Thinking.
- [ ] Chuẩn bị registration owner cho mock pitch lúc 13:00 Day 1.

## 21/09 — Day 1

- [ ] 07:30 check-in cùng đội; mang ID/laptop/charger/power strip/headphones.
- [ ] Đọc brief; khóa 1 employment stage + 1 primary barrier.
- [ ] Chuyển insight thành problem statement; không đổi focus area.
- [ ] Teach-back hai workshop trước 13:00.
- [ ] Đăng ký mock pitch ngay khi form mở nếu nhóm muốn.
- [ ] Cuối ngày: hero flow + deck skeleton + câu hỏi Day 2.

## 22/09 — Day 2

- [ ] Ghi evidence từ fireside chat; không quay/ghi người khác khi chưa consent.
- [ ] Hỏi mentor về stakeholder, cost, deployment và adoption.
- [ ] Hỏi technical consultant đúng một blocker lớn nhất.
- [ ] Ghi tối thiểu 2 thay đổi prototype dựa trên feedback.
- [ ] 15:00 mock pitch nếu có slot.
- [ ] 18:00 feature freeze; 21:00 deck freeze; 23:00 video draft.

## 23/09 — Day 3

- [ ] 04:45 export final files.
- [ ] 05:15 upload; 05:30 download/open verify; 06:00 buffer.
- [ ] Theo dõi email buổi sáng.
- [ ] 12:00–13:30 check-in finale.
- [ ] Nếu Top 8: dùng đúng deck đã nộp; pitch 10 phút gồm demo + Q&A 5 phút.

---

# 11. Phân vai đội 3 người

| Người | Trước hackathon | Day 1–2 | Submission/finale |
|---|---|---|---|
| Product & Accessibility Lead | research, interview guide, problem matrix | end-user evidence, scope, accessible UX | narrative, criteria coverage, Q&A UCD |
| Frontend & Demo Lead | renderer, fixture, accessibility UI | prototype integration, instrumentation | demo operator, screen recording, fallback |
| AI/Backend & Reliability Lead | ASR benchmark, evidence service | pipeline, validator, deployment/privacy | technical explanation, upload integrity, Q&A AI |

Mỗi người cần biết toàn bộ one-liner và failure policy; không để chỉ một người hiểu hệ thống.

---

# 12. Q&A dự kiến với giám khảo

## “Teams/Meet đã có caption. Sản phẩm khác gì?”

SignalFlow không cạnh tranh ở speech-to-text thuần túy. Nó bổ sung correction/uncertainty, evidence-linked context recovery và user-controlled information density cho hai accessibility needs có thể xung đột.

## “Tại sao kết hợp DHH và Neurodivergence?”

Không giả định hai nhóm giống nhau. Họ dùng chung evidence timeline nhưng có renderer riêng. Người dùng chọn cách nhận thông tin; hệ thống không tự suy diagnosis.

## “AI recap sai thì sao?”

Transcript nguyên văn là immutable source. Mỗi factual field cần `evidenceIds`; thiếu evidence thì abstain. User phải confirm action và có thể mở exact quote.

## “Tại sao không làm VSL translator?”

Continuous VSL translation đòi hỏi dữ liệu, ngôn ngữ học và Deaf-led validation lớn hơn phạm vi. VSL400 hiện là isolated-word/controlled-access resource; không đủ cho universal translator trong dưới 48 giờ.

## “Có thật sự live không?”

Primary demo stream một prepared audio fixture qua pipeline thật để tái lập. Live mic là secondary path. Nhóm nói rõ điều này và có deterministic fallback để đánh giá trải nghiệm thay vì may rủi network.

## “Làm sao biết sản phẩm giúp người dùng?”

Đo key-term accuracy, context-recovery time, evidence coverage, task answer accuracy và qualitative preference. Quan trọng hơn, trình bày thay đổi cụ thể sau fireside/end-user feedback.

## “Kế hoạch triển khai thực tế?”

Pilot dạng local-first PWA/meeting companion trong một workflow hẹp; không employer surveillance dashboard. Kiểm thử security/privacy, retention và Vietnamese workplace data trước integration lớn.

---

# 13. Risk Register và kill criteria

| Risk | Trigger | Response |
|---|---|---|
| Competition brief không phù hợp meeting | Barrier chính nằm ở stage khác | Giữ evidence/renderer kernel, đổi hero scenario theo adaptation matrix |
| Vietnamese ASR không ổn | Key-term <90% hoặc latency >2s | Prepared transcript/live-like fixture; caption correction; bỏ claim realtime |
| Diarization làm chậm | Speaker lỗi/lag sau timebox | Manual/known speaker labels |
| LLM hallucinate | Field thiếu evidence hoặc sai owner/deadline | Tắt generative layer; extractive recap |
| UI quá tải | End-user nói caption + recap cạnh tranh | Stack layout, giảm motion/density; on-demand recap |
| Không đủ user evidence | Chỉ có assumption | Tận dụng fireside; ghi limitation; không dựng quote giả |
| Upload/file lỗi | PPTX/video không mở ở máy khác | Internal 05:30 deadline; download verification |
| Video vượt 5 phút | Rough cut >4:55 | Cắt narration/appendix, không tăng playback speed quá mức |
| Deck sai template | Slide order/number thay đổi | Tạo từ official file; checklist trước export |
| Một thành viên vắng phiên bắt buộc | Attendance gap | Báo BTC bằng email với evidence càng sớm càng tốt |

### Kill criteria

- Không đạt live reliability sau fixed timebox → dùng prepared audio pipeline.
- Diarization không ổn → bỏ.
- Sound classification không trực tiếp giải quyết brief → bỏ.
- LLM không bảo đảm evidence → dùng extractive rules.
- Feature không xuất hiện trong hero flow hoặc không map tiêu chí → chuyển roadmap/appendix.
- Không bao giờ cắt consent, evidence, original transcript hoặc fallback để giữ hiệu ứng AI.

---

# 14. Administrative checklist

- Check-in theo cả đội; mang ID mỗi ngày.
- Áo ADC mặc Day 1 và Day 3; badge/lanyard phải nhìn thấy.
- Non-RMIT participants dùng RMIT Guest Wi-Fi; chấp nhận terms trên browser.
- Motorbike parking mở khoảng 06:00–22:00; lấy xe trước 22:00; phí được briefing nêu khoảng 4.000 VND/ngày cho external participant.
- Campus hoạt động khoảng 07:00–21:00; không được hiểu hackathon là cho phép overnight stay.
- Gia đình/bạn bè không được vào xem finale do giới hạn capacity.
- Giữ campus sạch; xin consent trước khi chụp/quay community members.
- Kiểm tra email và official Zalo group thường xuyên.

Nguồn: [venue/check-in](https://youtu.be/AhTFiT9bqzI?t=1708), [campus facilities](https://youtu.be/AhTFiT9bqzI?t=1987), [media consent](https://youtu.be/AhTFiT9bqzI?t=2180).

---

# 15. Final Recommendation

Trong ba ngày, nhóm không nên cố hoàn thành một “AI meeting platform”. Nhóm nên chứng minh một interaction có giá trị:

> Một nhân viên bỏ lỡ mạch hội thoại. Họ chọn cách hiển thị phù hợp, sửa một caption quan trọng, bấm “I lost the thread”, nhận tối đa ba dòng có timestamp và thấy hệ thống từ chối bịa một deadline không có bằng chứng.

Để interaction này đạt điểm cao:

1. Gắn nó với đúng barrier và employment stage được phát Day 1.
2. Dùng end-user feedback Day 2 để thay đổi ít nhất hai quyết định UI/scope.
3. Trình bày AI như một pipeline có giới hạn, không phải phép màu.
4. Ưu tiên demo tái lập, accessibility và traceability.
5. Nộp deck/video đúng template, đúng định dạng, đúng ngôn ngữ và sớm hơn deadline ít nhất 90 phút.

Nếu brief Day 1 xác nhận meeting/training là barrier trọng tâm, tiếp tục SignalFlow. Nếu không, giữ lại **evidence timeline + adaptive renderer + grounded recovery** và đổi hero scenario sang interview, onboarding hoặc learning. Đây là cách tận dụng nghiên cứu và code đã có mà không cố ép brief vào ý tưởng chuẩn bị trước.

---

# Phụ lục A — Verified source index

- [ADC Hackathon 2026 Online Briefing](https://youtu.be/AhTFiT9bqzI)
- [ADC Hackathon 2026 official website](https://industryhub.rmit.edu.vn/ADC/)
- [Deep Research Focus Report — DHH + Neurodivergence](./ADC_Hackathon_2026_DHH_Neurodivergence_Deep_Research.md)
- [W3C Collaboration Tools Accessibility User Requirements](https://www.w3.org/TR/ctaur/)
- [W3C Media Accessibility User Requirements](https://www.w3.org/TR/media-accessibility-reqs/)
- [W3C Cognitive Accessibility](https://www.w3.org/WAI/cognitive/)
- [PhoASR-whisper-small](https://huggingface.co/Qualcomm-AI-Research/PhoASR-whisper-small)
- [PhoWhisper](https://huggingface.co/vinai/PhoWhisper-base)
- [Mozilla Common Voice](https://commonvoice.mozilla.org/en/datasets)
- [AMI Meeting Corpus](https://groups.inf.ed.ac.uk/ami/corpus/)
- [QMSum](https://aclanthology.org/2021.naacl-main.472/)
- [VSL400](https://zenodo.org/records/17943574)

# Phụ lục B — Pending confirmations

Các điểm sau phải kiểm tra trong email/template/Day 1 thay vì tự suy đoán:

- tên và định nghĩa chính xác của sáu employment stages;
- title/content bắt buộc của từng slide trong official template;
- submission portal, size limit và file-upload mechanics;
- wording chính xác của focus-area assignment của đội;
- evaluator composition và rubric weighting, nếu có;
- việc prototype URL có được click/access trong evaluation environment hay không;
- yêu cầu accessibility chi tiết cho video/deck ngoài các hướng dẫn đã nêu;
- policy lưu trữ/chia sẻ dữ liệu nếu prototype dùng cloud API.
