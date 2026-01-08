# Hướng dẫn đọc `tests/mock-employee-list.spec.js`

Tài liệu này giúp bạn hiểu nhanh cấu trúc và logic test mock danh sách nhân viên.

## Mục tiêu của file test
- Đăng nhập một lần, tái sử dụng page cho mọi case.
- Mock API danh sách nhân viên (`api-timesheet-booking.kiotviet.vn/employees/...`) với các kịch bản:
  1) Trả về 3 nhân viên mẫu (success fixture).
  2) Trả về danh sách trống (empty fixture).
  3) Trả về lỗi 500.
- Điều hướng tới trang danh sách nhân viên và xác nhận response mock đã được dùng (dựa trên status/payload).

## Biến cấu hình chính
- `retailer`, `username`, `password`, `loginUrl`, `employeeListUrl` lấy từ biến môi trường, có giá trị mặc định. Có thể override bằng `.env` hoặc khi chạy lệnh.
- `employeeApiPattern`: pattern route chặn API employees của timesheet.

## Fixture sử dụng
- `tests/fixtures/employee-list-success.json`: response có 3 nhân viên mẫu, cấu trúc `{"result": {"total": 3, "data": [...]}}`.
- `tests/fixtures/employee-list-empty.json`: response `{"result": {"total": 0, "data": []}}`.

## Luồng logic chính trong file test
1) **Chuẩn bị**: `beforeAll` tạo `context`, `sharedPage`, thực hiện `loginOnce(sharedPage)` (điền form, submit, đóng pop-up, bấm “Quản lý” nếu thấy).
2) **Mock API**: `mockEmployeeApi(page, { status, body })` đăng ký `page.route(employeeApiPattern)` và fulfill với body/status mong muốn.
3) **Đi tới trang cùng mock**: `gotoEmployeeListWithMock(page, { status, body })`
   - `unroute` pattern cũ (nếu có) để thay mock mới.
   - Gọi `mockEmployeeApi`.
   - `waitForResponse(employeeApiPattern)` -> bắt response đầu tiên khớp pattern.
   - `page.goto(employeeListUrl)` và `expect` URL.
   - Trả về response để assert payload.
4) **Các case test** (chạy `serial` trên cùng page):
   - **mock API trả danh sách đầy đủ**: mock success fixture, assert status 200 và `payload.result.data.length === 3`.
   - **mock API trả danh sách trống**: mock empty fixture, assert status 200 và length 0.
   - **mock API trả lỗi 500**: mock body lỗi, assert status 500.
5) **Kết thúc**: `afterAll` đóng context.

## Mẹo quan sát và debug
- Chạy kèm giao diện và chậm lại:  
  `npx playwright test tests/mock-employee-list.spec.js -g "mock API trả danh sách đầy đủ" --headed --slow-mo=300`
- Dừng tại trang để xem UI/Network: chèn `await page.pause();` trong case cần xem, chạy với `PWDEBUG=1 ...`.
- In payload ra terminal: giữ `console.log('Mock payload', payload);` trong case trống hoặc thêm log tạm thời ở case khác.

## Thay đổi nhanh pattern API nếu cần
- Nếu UI gọi endpoint khác, sửa `employeeApiPattern` cho khớp URL thực tế (dùng `page.pause()` và tab Network để copy URL rồi cập nhật pattern/wildcard).

## Override URL/cred
- Qua env:
  - `KV_RETAILER`, `KV_USERNAME`, `KV_PASSWORD`
  - `WEB_LOGIN_URL`, `EMPLOYEE_LIST_URL`
- Khi chạy:  
  `KV_USERNAME=myuser KV_PASSWORD=mypass npx playwright test tests/mock-employee-list.spec.js`
