import { test, expect } from '@playwright/test';
import { EmpCalendarPage } from './pages/EmpCalendarPage';

const retailer = process.env.KV_RETAILER ?? 'lutest16';
const username = process.env.KV_USERNAME ?? 'admin';
const password = process.env.KV_PASSWORD ?? '123';
const loginUrl = process.env.WEB_LOGIN_URL ?? 'https://salon.kiotviet.vn/mhqlv2/a/login';

// Hàm hỗ trợ xử lý popup khi login
async function closeLoginModals(page) {
  // Modal chào mừng (nút X)
  try {
    await page.locator('.vodal-close').first().click({ timeout: 4000 });
  } catch (e) {
    // bỏ qua nếu không tồn tại
  }

  // Modal thông báo (nút Close)
  try {
    await page.getByRole('button', { name: 'Close' }).click({ timeout: 2000 });
  } catch (e) {
    // bỏ qua nếu không tồn tại
  }
}

test('Chọn "Xem theo ca" trên trang Lịch làm việc nhân viên', async ({ page }) => {
  // 1. Vào màn login
  // Lưu ý: url yêu cầu của user có qs ?retailerCode=lutest16, nhưng logic giả lập gõ phím.
  // Chúng ta theo logic từ mock-employee-list để ổn định.
  await page.goto(loginUrl);
  
  // Điền thông tin đăng nhập
  await page.locator('#retailerInp').fill(retailer);
  await page.locator('#userNameInp').fill(username);
  await page.locator('#userPasswordInp').fill(password);
  await page.locator('#userPasswordInp').press('Enter');
  
  // Xử lý modal
  await closeLoginModals(page);

  // Xử lý nút "Quản lý" nếu có (từ logic mock-employee-list)
  try {
    const manageButton = page.getByRole('button', { name: 'Quản lý' });
    if (await manageButton.isVisible({ timeout: 5000 })) {
      await manageButton.click();
    }
  } catch (e) {
    // bỏ qua
  }

  // 2. Vào https://salon.kiotviet.vn/mhqlv2/lutest16/p/emp-calendar
  await page.goto(`https://salon.kiotviet.vn/mhqlv2/${retailer}/p/emp-calendar`);
  
  // 3. Click vào locator('kendo-dropdownlist') & 4. Click getByRole('option', { name: 'Xem theo ca' })
  // Sử dụng Page Object
  const empCalendarPage = new EmpCalendarPage(page);
  await empCalendarPage.selectViewType('Xem theo ca');

  // Thêm một khoảng dừng nhỏ hoặc assertion để đảm bảo hành động hoàn tất có thể nhìn thấy
  // (Tùy chọn, tốt cho việc xác minh)
  await expect(page.locator('kendo-dropdownlist')).toBeVisible();
});
