# Cầu Nối — prototype ADC

Web demo hai chiều: người dùng diễn đạt nhu cầu → tự duyệt câu → người nhận nhận nguyên văn → tự duyệt phản hồi → người dùng bổ sung hoặc xác nhận đóng yêu cầu.

## Chạy

Yêu cầu Node.js 20 trở lên. Mở terminal tại `C:\Hackathon`:

```powershell
npm ci
npm start
```

Mở http://127.0.0.1:8777/ hoặc http://127.0.0.1:8777/prototype/bridge.html. Một server phục vụ trang và API. Không mở HTML qua file://. Dừng bằng Ctrl+C. Chỉ lắng nghe trên máy cục bộ; đây không phải ứng dụng production.

```powershell
npm run validate
npm test
```

Không cần API key để chạy demo đầy đủ bằng câu mẫu. Không cần kết nối Internet sau khi đã cài thư viện và khởi động server, khi tắt AI.

## Bật AI tùy chọn

Ba lệnh sau lần lượt tạo file cấu hình (chỉ chạy lệnh đầu nếu chưa có .env), mở để tự nhập key và khởi động server:

```powershell
Copy-Item .env.example .env
notepad .env
npm start
```

Đặt `GEMINI_API_KEY` và `GEMINI_MODEL` trong `.env`. Model mặc định là `gemini-3.5-flash-lite` để ưu tiên độ trễ demo; có thể đổi sang model Gemini hỗ trợ `generateContent` và structured output mà tài khoản được cấp quyền. Không đưa key vào trình duyệt, git hoặc ảnh chụp. `.env` được gitignore và không được static server phục vụ.

Checkbox AI mặc định tắt. Bật checkbox chưa gửi dữ liệu; chỉ bấm Tìm cách diễn đạt mới gửi `{rawText,intentId,allowedFacts:{ticket}}`. Không gửi sơ đồ tổ chức. Tuy nhiên tên hoặc thông tin nhạy cảm người dùng tự gõ trong rawText vẫn nằm trong payload: đừng nhập dữ liệu thật nhạy cảm để demo.

Proxy không ghi nội dung vào file/log. Nhà cung cấp AI có chính sách xử lý/lưu trữ riêng; không tuyên bố dữ liệu không rời máy khi bật AI.

## Hành vi và trạng thái

- 9 intent + abstain; 30 câu mẫu; 6 đầu mối hư cấu; 15 thuật ngữ và 5 workplace norms được lọc theo intent.
- Cho chọn lại intent nếu keyword engine hiểu sai. Điểm khớp từ không phải xác suất hoặc chẩn đoán.
- B thấy nguyên văn `userApprovedText`; gợi ý hành động nằm riêng và được ghi nhãn là dữ liệu mẫu.
- B có accept / clarify / redirect và ô sửa. Redirect chỉ đề xuất đầu mối, không chuyển tin tự động.
- A được gửi thông tin bổ sung; chỉ A xác nhận mới chuyển sang resolved.
- Mỗi thời điểm có một yêu cầu đang hoạt động. Làm lại xóa dữ liệu demo trong bộ nhớ. Refresh cũng mất dữ liệu; không có database/localStorage.
- Bản ghi demo chứa rawInput và tin nhắn, nằm trong phần thu gọn trên cùng máy, không phải dashboard quản lý. Không chia sẻ màn hình mục này với dữ liệu thật.

## API

| HTTP | Kết quả | Giao diện |
|---|---|---|
| 200 | mode llm, options neutral/direct/soft | Cho chọn cả bộ ba đã qua kiểm tra tự động |
| 200 | mode fallback; NO_KEY / TIMEOUT / API_ERROR / RATE_LIMIT / VALIDATION_FAILED | Giữ cả bộ câu mẫu |
| 400 | mode error, BAD_INPUT | Hiện lỗi, không tự gọi lại |

Backend timeout 5 giây, browser timeout 5,5 giây; proxy không retry. Sửa đầu vào, đổi mode, reset hoặc chọn lại intent hủy request trước và bỏ qua kết quả cũ. Câu trả lời LLM không trộn với câu mẫu. LLM ID: llm-neutral / llm-direct / llm-soft. Evidence dùng source llm/fallback/user; LOCAL_MODE là nhãn nội bộ cho lựa chọn câu mẫu chủ động.

Validator gồm schema, echo intentId/confident, token số/ngày/thứ/ticket, tên trong org_map, năm mẫu tuyên bố quá khứ. Đây là heuristic giới hạn, không kiểm chứng ngữ nghĩa, không đảm bảo chống mọi prompt injection, không nhận diện mọi tên người. Luôn cần người dùng duyệt. Câu mẫu cũng cần được người dùng kiểm tra, vì có thể chứa giả định chưa đúng.

## Ranh giới sản phẩm

Không tự gửi tin/tạo task; không suy luận chẩn đoán, cảm xúc, mức chú ý hay năng suất; không đếm số lần xin hỗ trợ để HR theo dõi; không ghi nội dung vào log; không hứa mọi yêu cầu sẽ được chấp thuận. Workplace norms là chính sách hư cấu có nhãn, không phải quy tắc đúng cho mọi công ty.

Chưa làm: đăng nhập, phân quyền nhiều người, database, Slack/Teams thật, app mobile, task-fit diary, dữ liệu gộp, quản trị đa công ty. Hai cột là hai vai trong cùng browser, không phải hai tài khoản bảo mật.

## Mở rộng cả 6 stage

Engine không khóa stage. Quy tắc nhận diện, định tuyến và nội dung hỗ trợ nằm trong data; persona/nhãn giao diện vẫn là Workplace Pack. Hiện demo tập trung Stage 4 và có intent cân chỉnh thử thách liên quan Stage 6; chưa có đủ nội dung đã kiểm chứng cho cả sáu stage.

| Stage | Gói nội dung có thể bổ sung sau co-design |
|---|---|
| 1 Career preparation | Nêu thế mạnh/nhu cầu với cố vấn; không gán nghề từ chẩn đoán |
| 2 Job search & application | Hỏi làm rõ JD, yêu cầu cách nộp hồ sơ phù hợp |
| 3 Interview | Yêu cầu thông tin quy trình và cách giao tiếp phù hợp |
| 4 Onboarding | Hỏi đúng đầu mối, làm rõ công việc/quy ước |
| 5 On the job | Báo vướng mắc và chủ động xin hỗ trợ |
| 6 Development & retention | Cân chỉnh thử thách, khối lượng và cách học |

Đổi pack phải xác minh lại org_map, intent, norms với người dùng/đơn vị; không chỉ đổi tên JSON rồi tuyên bố phù hợp mọi ngành.

## Kiểm thử và giới hạn nghiệm thu

Xem `IMPLEMENTATION-NOTES.md`. Provider thật chưa được kiểm thử khi không có key. Tests dùng fake provider phải được gọi đúng là mô phỏng, không phải LLM thật. Chưa chứng nhận WCAG hoặc thử với người dùng thực tế.
