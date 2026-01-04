import { request, APIRequestContext } from '@playwright/test';
import { loginAndGetToken, loginDefaults } from './login';

const API_BASE_URL =
  process.env.API_BASE_URL ?? 'https://api-timesheet-booking.kiotviet.vn';

// Tạo context API có sẵn header auth/retailer để gọi các API timesheet
export async function createEmployeeApiContext(): Promise<APIRequestContext> {
  const { token, retailer } = await loginAndGetToken();

  return request.newContext({
    baseURL: API_BASE_URL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`,
      'x-retailer-code': retailer,
      retailer,
      branchid: loginDefaults.branchId.toString(),
      fingerprintkey: loginDefaults.fingerprint,
      origin: 'https://salon.kiotviet.vn',
      referer: 'https://salon.kiotviet.vn/',
    },
  });
}

export { loginDefaults, API_BASE_URL };
