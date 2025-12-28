import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Đăng nhập hệ thống
  await page.goto('https://salon.kiotviet.vn/mhqlv2/a/login');
  await page.locator('#retailerInp').click();
  await page.locator('#retailerInp').fill('lutest16');
  await page.locator('#userNameInp').click();
  await page.locator('#userNameInp').fill('admin');
  await page.locator('#userPasswordInp').click();
  await page.locator('#userPasswordInp').fill('123');
  await page.getByRole('button', { name: 'Quản lý' }).click();
  // Đóng pop-up mặc định
  await page.locator('.vodal-close').first().click();
  await page.getByRole('button', { name: 'Đánh giá sau' }).click();
  // Điều hướng tới Bảng chấm công
  await page.getByText('Nhân viên').first().click();
  await page.getByRole('link', { name: 'Bảng chấm công' }).click();
  // Mở ca chưa chấm công và chọn giờ vào/ra
  await page.getByText('Chưa chấm công').nth(0).click();
  await page.getByText('Vào').click();
  await page.locator('label').filter({ hasText: 'Ra' }).click();
  // Đọc khung giờ ca và so sánh với giờ nhập
  const timeIn = page.getByRole('textbox').nth(1);
  const timeOut = page.getByRole('textbox').nth(2);
  const choseTime = await page.getByRole('dialog').getByRole('combobox').textContent();
  const timeRange = (choseTime as string).split('(').pop()?.replace(')', '').trim() as string;
  // ví dụ:
  // timeRange = "07:00 - 11:00"
  // timeRange.split('-') → mảng ["07:00 ", " 11:00"] (vẫn còn khoảng trắng)
  // .map((t) => t.trim()) → trim() loại bỏ khoảng trắng đầu/cuối mỗi phần tử, thành ["07:00", "11:00"]
  const [expectedTimeIn, expectedTimeOut] = timeRange.split('-').map((t) => t.trim());
  await expect(timeIn).toHaveValue(expectedTimeIn);
  await expect(timeOut).toHaveValue(expectedTimeOut);

  // Lưu ca làm việc và kiểm tra thông báo thành công
  await page.getByRole('button', { name: 'Lưu' }).click();
  // Kiểm tra thông báo dạng toast xem đã hiển thị thành công chưa
  await expect(
    page.getByText('Cập nhật chi tiết ca làm việc thành công', { exact: true })
  ).toBeVisible();
});
