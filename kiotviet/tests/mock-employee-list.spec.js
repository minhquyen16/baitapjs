import { test, expect } from '@playwright/test';
import successEmployeeListBody from './fixtures/employee-list-success.json' assert { type: 'json' };
import emptyEmployeeListBody from './fixtures/employee-list-empty.json' assert { type: 'json' };

const retailer = process.env.KV_RETAILER ?? 'lutest16';
const username = process.env.KV_USERNAME ?? 'admin';
const password = process.env.KV_PASSWORD ?? '123';
const loginUrl =
  process.env.WEB_LOGIN_URL ?? 'https://salon.kiotviet.vn/mhqlv2/a/login';
const employeeListUrl =
  process.env.EMPLOYEE_LIST_URL ??
  `https://salon.kiotviet.vn/mhqlv2/${retailer}/p/emp-management`;
const employeeApiPattern =
  '**api-timesheet-booking.kiotviet.vn/employees/**';

let context;
let sharedPage;

async function closeLoginModals(page) {
  // Modal chào mừng (nút X)
  try {
    await page.locator('.vodal-close').first().click({ timeout: 4000 });
  } catch (e) {
    // ignore if not present
  }

  // Modal thông báo (nút Close)
  try {
    await page.getByRole('button', { name: 'Close' }).click({ timeout: 2000 });
  } catch (e) {
    // ignore if not present
  }
}

async function loginOnce(page) {
  await page.goto(loginUrl);
  await page.locator('#retailerInp').fill(retailer);
  await page.locator('#userNameInp').fill(username);
  await page.locator('#userPasswordInp').fill(password);
  await page.locator('#userPasswordInp').press('Enter');
  await closeLoginModals(page);

  const manageButton = page.getByRole('button', { name: 'Quản lý' });
  if (await manageButton.isVisible()) {
    await manageButton.click();
  }
}

async function mockEmployeeApi(page, { status = 200, body }) {
  await page.route(employeeApiPattern, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

async function gotoEmployeeListWithMock(page, { status = 200, body }) {
  await page.unroute(employeeApiPattern).catch(() => {});
  await mockEmployeeApi(page, { status, body });

  const responsePromise = page.waitForResponse(employeeApiPattern);
  await page.goto(employeeListUrl);
  await expect(page).toHaveURL(employeeListUrl);
  return responsePromise;
}

test.describe('Mock danh sách nhân viên', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    sharedPage = await context.newPage();
    await loginOnce(sharedPage);
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test('mock API trả danh sách đầy đủ', async () => {
    const response = await gotoEmployeeListWithMock(sharedPage, {
      body: successEmployeeListBody,
    });
    const payload = await response.json();
    expect(response.status()).toBe(200);
    expect(Array.isArray(payload.result?.data)).toBe(true);
    expect(payload.result.data.length).toBe(3);
  });

  test('mock API trả danh sách trống', async () => {
    const response = await gotoEmployeeListWithMock(sharedPage, {
      body: emptyEmployeeListBody,
    });
    const payload = await response.json();
    console.log('Mock payload', payload);
    expect(response.status()).toBe(200);
    expect(payload.result?.data?.length ?? 0).toBe(0);
  });

  test('mock API trả lỗi 500', async () => {
    const response = await gotoEmployeeListWithMock(sharedPage, {
      status: 500,
      body: { message: 'Internal Server Error' },
    });
    expect(response.status()).toBe(500);
  });
});
