import { test, expect } from '@playwright/test';
import { randomName, randomPhone } from './api/data.js';

const retailer = process.env.KV_RETAILER || 'lutest16';
const username = process.env.KV_USERNAME || 'admin';
const password = process.env.KV_PASSWORD || '123';

test('test', async ({ page }) => {
  // Đăng nhập tài khoản quản lý
  const loginUrl = process.env.WEB_LOGIN_URL || 'https://salon.kiotviet.vn/mhqlv2/a/login';
  await page.goto(loginUrl);
  await page.locator('#retailerInp').click();
  await page.locator('#retailerInp').fill(retailer);
  await page.locator('#userNameInp').click();
  await page.locator('#userNameInp').fill(username);
  await page.locator('#userPasswordInp').click();
  await page.locator('#userPasswordInp').fill(password);
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
  const employeeName = randomName();
  const phone = randomPhone();
  await page.locator('#ts-employee-name').fill(employeeName);
  await page.getByRole('textbox').nth(2).click();
  await page.getByRole('textbox').nth(2).fill(phone);
  // Lưu nhân viên mới
  await page.getByRole('button', { name: 'Lưu' }).click();
  await page.getByRole('button', { name: 'Lưu & Bỏ qua' }).click();
  // Xác nhận tên nhân viên vừa tạo hiển thị trong danh sách
  const employeeNameCell = page.getByRole('gridcell', { name: employeeName });
  await expect(employeeNameCell).toHaveText(employeeName);
});
