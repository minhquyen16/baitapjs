import { request } from '@playwright/test';
import { loginAndGetToken, loginDefaults } from './login.js';

const TIMESHEET_API_BASE =
  process.env.API_BASE_URL ?? 'https://api-timesheet-booking.kiotviet.vn';
const SALON_API_BASE = process.env.SALON_BASE_URL ?? 'https://salon.kiotviet.vn';

// Tạo hai context API: timesheet (đọc/cập nhật/xóa) và salon (tạo)
export async function createApiClients() {
  // Đăng nhập lấy token + retailer
  const { token, retailer } = await loginAndGetToken();

  // Header chung cho mọi request
  const headers = {
    Authorization: `Bearer ${token}`,
    'x-retailer-code': retailer,
    retailer,
    branchid: loginDefaults.branchId.toString(),
    fingerprintkey: loginDefaults.fingerprint,
    origin: 'https://salon.kiotviet.vn',
    referer: 'https://salon.kiotviet.vn/',
  };

  // Context dành cho timesheet API
  const timesheetApi = await request.newContext({
    baseURL: TIMESHEET_API_BASE,
    extraHTTPHeaders: headers,
  });

  // Context dành cho salon API (nếu cần)
  const salonApi = await request.newContext({
    baseURL: SALON_API_BASE,
    extraHTTPHeaders: headers,
  });

  return { timesheetApi, salonApi };
}

export { loginDefaults, TIMESHEET_API_BASE, SALON_API_BASE };
