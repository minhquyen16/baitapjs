// Hàm dùng chung để tạo tên/số điện thoại ngẫu nhiên cho test
export function randomName() {
  const suffix = Math.random().toString(36).slice(2, 6);
  return `Nguyen Van ${suffix}`;
}

export function randomPhone() {
  return '09' + Math.floor(10000000 + Math.random() * 90000000);
}
