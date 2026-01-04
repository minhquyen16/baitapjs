import { request } from '@playwright/test';

// Thông tin mặc định; có thể override bằng biến môi trường khi chạy test
const cfg = {
  baseURL: process.env.AUTH_BASE_URL ?? 'https://api-salon.kiotviet.vn',
  retailer: process.env.KV_RETAILER ?? 'lutest16',
  username: process.env.KV_USERNAME ?? 'admin',
  password: process.env.KV_PASSWORD ?? '123',
  fingerprint:
    process.env.KV_FINGERPRINT ??
    '066fd5a632c3bac2ed64a409d9636ba0_Chrome_Desktop_M%C3%A1y%20t%C3%ADnh%20Mac%20OS',
  branchId: Number(process.env.KV_BRANCH_ID ?? '2987'),
  tenantId: Number(process.env.KV_TENANT_ID ?? '200032924'),
};

type LoginResult = { token: string; retailer: string };

// Gọi API login và trả ra JWT để dùng cho các request tiếp theo
export async function loginAndGetToken(): Promise<LoginResult> {
  const ctx = await request.newContext({
    baseURL: cfg.baseURL,
    extraHTTPHeaders: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
      fingerprintkey: cfg.fingerprint,
      origin: 'https://salon.kiotviet.vn',
      referer: 'https://salon.kiotviet.vn/',
      retailer: cfg.retailer,
      'x-retailer-code': cfg.retailer,
    },
  });

  const res = await ctx.post('/v2/identity/users/login', {
    data: {
      provider: 'credentials',
      Retailer: cfg.retailer,
      UserName: cfg.username,
      Password: cfg.password,
      RememberMe: true,
      UseTokenCookie: true,
      language: 'vi-VN',
      FingerPrintKey: cfg.fingerprint,
    },
  });

  if (!res.ok()) {
    const msg = await res.text();
    await ctx.dispose();
    throw new Error(`Login thất bại: ${res.status()} - ${msg}`);
  }

  const data = await res.json();
  await ctx.dispose();

  // bearerToken nằm trong data.result ở response mẫu
  const token = data?.result?.bearerToken;

  if (!token) {
    const keys = data && typeof data === 'object' ? Object.keys(data) : typeof data;
    throw new Error(`Không lấy được token từ response login. Keys: ${keys}`);
  }

  return { token, retailer: cfg.retailer };
}

// Tham số dùng chung ở các file test khác
export const loginDefaults = {
  retailer: cfg.retailer,
  branchId: cfg.branchId,
  tenantId: cfg.tenantId,
  fingerprint: cfg.fingerprint,
};
