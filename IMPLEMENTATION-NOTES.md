# Báo cáo triển khai — 22/09/2026

## Đã thực hiện

- Baseline trước sửa: sáu kiểm tra logic bằng Node/VM trên mã cũ (khớp từ, không dấu, abstain, ticket, gửi rỗng, dấu vết nguồn) đạt. Không có screenshot baseline thành công vì lúc đó chưa có server.
- Task 1–2: tách nguyên văn A duyệt khỏi gợi ý hỗ trợ; thêm ba kiểu phản hồi B, sửa trước gửi, lưu nguồn và bản đã duyệt. Thêm A bổ sung thông tin để nhánh clarify không thành ngõ cụt. Chỉ A đóng yêu cầu.
- Task 5: Node proxy, Gemini REST adapter, strict schema, validator giới hạn, timeout/cancel, static fallback, AI opt-in, không ghi nội dung vào log, static allowlist không lộ file cấu hình.
- Task 3–4: intent under-stimulated tới manager, năm workplace norms có relatedIntentIds; chuyển terms sang entries và giữ các termId cũ.
- Giao diện dùng textContent, live regions, focus chủ động, CSS responsive, chữ chính từ 15px. Có chọn lại nhu cầu khi keyword engine hiểu sai.
- Bảo toàn prototype/index.html và tài liệu nghiên cứu cũ. Không triển khai hoặc gửi dữ liệu tới dịch vụ ngoài.

## File thay đổi/tạo

| Nhóm | File |
|---|---|
| Giao diện | prototype/bridge.html, prototype/bridge.mjs, prototype/core.mjs |
| Backend | server/app.mjs, server/ai.mjs |
| Dữ liệu | data/intents_vi.json, data/glossary_vi.json |
| Kiểm thử | tests/bridge.test.mjs, scripts/validate-data.mjs |
| Vận hành | package.json, package-lock.json, .env.example, .gitignore, README.md |

org_map.json chỉ đọc, không thay đổi. `.env` không được tạo hoặc điền key tự động.

## Kết quả kiểm thử

Tự động: `npm test` — 7 test groups PASS, gồm normalization/whole-word/abstain/routing/ticket, request strict schema, output schema/ID/confidence/unsupported facts, fallback codes với provider giả, token ngày/thứ/tên, tránh false-positive tên tiếng Việt, HTTP allowlist và origin. `npm run validate` — 10 intent gồm fallback, 30 phrasing, 5 linked norms; ID/route/reference checks PASS. Node syntax checks PASS.

Trình duyệt: đã chạy tình huống chưa rõ API-142, sửa câu A và câu B, nhận lại đúng văn bản; payload HTML được hiển thị như chữ; intent thiếu thử thách tới Chị Mai; NO_KEY fallback; vòng clarify → A bổ sung bằng bàn phím → B phản hồi → A đóng; reset; abstain tới buddy như gợi ý đầu mối làm rõ; redirect ghi rõ chưa chuyển tin; cổng xác nhận chặn thao tác chưa duyệt. Đã xem screenshot bố cục desktop.

## Chưa nghiệm thu hoặc chủ động hoãn

- API Gemini thật: key đã xác thực; `gemini-3.5-flash-lite` đã trả ba câu structured output qua backend và hiển thị nhãn AI trên browser. Ba lần thử API liên tiếp trước kiểm thử UI hoàn thành khoảng 1,5–2,4 giây. Chưa kiểm thử tải lớn, quota/rate limit thật hoặc một bộ prompt-injection/eval đầy đủ. Provider giả trong unit tests vẫn chỉ là mô phỏng.
- Heuristic không bảo đảm mọi câu đều trung thực, không phát hiện mọi tên người/suy diễn. Không tuyên bố chống injection tuyệt đối. User review là bước bắt buộc.
- Chưa thử ngắt mạng vật lý, toàn bộ race conditions trên trình duyệt, ba vòng đầy đủ liên tiếp trên cùng một bản build, hoặc audit console bằng công cụ chuyên dụng. Các nhánh chính đã thử riêng như trên.
- Chưa audit WCAG đầy đủ, mobile viewport hoặc screen reader thật; live region và keyboard support mới là triển khai ban đầu, không phải chứng nhận.
- Task 6 khung chat giả với thanh kênh: hoãn phần trang trí. Giữ giao diện hai vai có nhãn mô phỏng, không tạo ấn tượng đã tích hợp Slack/Teams hoặc bảo đảm ẩn danh.
- Chưa có đủ nội dung co-design cho cả sáu stage. Engine/data cho phép mở rộng, README có hướng cho cả sáu; Workplace Pack hiện là dữ liệu demo, không phải giải pháp đã xác nhận cho mọi nhóm/ngành.

## Kịch bản demo ngắn

1. Mở trang, để AI tắt; chọn Chưa rõ task, bấm Tìm cách diễn đạt.
2. Chỉ ra ticket, đầu mối và quy ước mẫu. Thử nút chưa xác nhận để thấy bị chặn.
3. Chọn câu, sửa một chi tiết; bấm Xác nhận & Gửi. So nguyên văn hai phía.
4. B chọn Cần làm rõ, sửa câu và gửi. A bổ sung; B phản hồi; A xác nhận đóng.
5. Làm lại, chọn Thiếu thử thách để minh họa mở rộng Stage 6. Có thể bật AI để trình bày ba câu Gemini có nhãn nguồn; nếu mạng lỗi hoặc hết quota, giải thích fallback thay vì gọi câu mẫu là output AI.

Chạy bằng `npm start`; cấu hình key/model riêng trong `.env` theo README. Server chỉ localhost, chưa có authentication/multi-user nên không đưa lên Internet hay dùng dữ liệu nhân sự thật.
