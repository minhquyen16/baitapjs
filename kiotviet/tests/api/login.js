import { request } from '@playwright/test';

// Cấu hình mặc định; có thể override bằng biến môi trường
const cfg = {
  baseURL: process.env.AUTH_BASE_URL ?? 'https://api-salon.kiotviet.vn',
  retailer: process.env.KV_RETAILER ?? 'lutest16',
  username: process.env.KV_USERNAME ?? 'admin',
  password: process.env.KV_PASSWORD ?? '123',
  branchId: Number(process.env.KV_BRANCH_ID ?? '2987'),
  tenantId: Number(process.env.KV_TENANT_ID ?? '200032924'),
};

// Gọi API login và trả ra JWT để dùng cho các request tiếp theo
export async function loginAndGetToken() {
  const ctx = await request.newContext({
    baseURL: cfg.baseURL,
    extraHTTPHeaders: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
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
      Password: cfg.password
    },
  });
  const data = await res.json();
  await ctx.dispose();

  const token = data?.result?.bearerToken;
  return { token, retailer: cfg.retailer };
}

// Tham số dùng chung ở các file test khác
export const loginDefaults = {
  retailer: cfg.retailer,
  branchId: cfg.branchId,
  tenantId: cfg.tenantId,
  fingerprint: cfg.fingerprint,
};
