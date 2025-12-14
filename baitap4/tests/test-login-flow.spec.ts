import { test, expect } from '@playwright/test';

test.describe('Login Flow Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Sử dụng getByRole để tương tác với các trường nhập liệu và nút
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('student');

    // Sử dụng locator với selector CSS để tương tác với trường mật khẩu
    await page.locator('#password').click();
    await page.locator('#password').fill('Password123');
    
    await page.getByRole('button', { name: 'Submit' }).click();

    // Kiểm tra nếu đăng nhập thành công bằng cách xác nhận URL chứa đường dẫn thành công
    await expect(page).toHaveURL(/\/logged-in-successfully\//);
  });

  test('should show error with invalid username', async ({ page }) => {
    // Sử dụng getByRole để tương tác với các trường nhập liệu và nút
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('wronguser');

    // Sử dụng locator với selector CSS để tương tác với trường mật khẩu
    await page.locator('#password').click();
    await page.locator('#password').fill('Password123');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('#error')).toHaveText('Your username is invalid!');
  });
});
