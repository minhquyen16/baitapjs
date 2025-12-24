import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Đăng nhập tài khoản quản lý
  await page.goto('https://salon.kiotviet.vn/mhqlv2/a/login');
  await page.locator('#retailerInp').click();
  await page.locator('#retailerInp').fill('lutest16');
  await page.locator('#userNameInp').click();
  await page.locator('#userNameInp').fill('admin');
  await page.locator('#userPasswordInp').click();
  await page.locator('#userPasswordInp').fill('123');
  await page.locator('#userPasswordInp').press('Enter');
  await page.getByRole('button', { name: 'Quản lý' }).click();
  // Đóng các pop-up chào mừng/nhắc nhở
  await page.locator('.vodal-close').first().click();
  await page.getByRole('button', { name: 'Close' }).click();
  // Điều hướng tới màn danh sách nhân viên
  await page.getByText('Nhân viên').first().hover();
  await page.getByRole('link', { name: 'Danh sách nhân viên' }).click();
  await page.getByRole('button', { name: '+ Nhân viên' }).click();
  await page.locator('#ts-employee-name').click();
  // Tạo tên và số điện thoại ngẫu nhiên
  const nameSuffix = Math.random().toString(36).slice(2, 6);
  await page.locator('#ts-employee-name').fill(`Nguyen Van ${nameSuffix}`);
  const randomPhone = '09' + Math.floor(10000000 + Math.random() * 90000000);
  await page.getByRole('textbox').nth(2).click();
  await page.getByRole('textbox').nth(2).fill(randomPhone);
  // Lưu nhân viên mới
  await page.getByRole('button', { name: 'Lưu' }).click();
  await page.getByRole('button', { name: 'Lưu & Bỏ qua' }).click();
  // Xác nhận tên nhân viên vừa tạo hiển thị trong danh sách
  const employeeName = page.getByRole('gridcell', { name: `Nguyen Van ${nameSuffix}` });
  await expect(employeeName).toHaveText(`Nguyen Van ${nameSuffix}`);
});
