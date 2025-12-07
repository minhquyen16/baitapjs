/**
 * kiemTraDangNhap kiểm tra tài khoản và mật khẩu có khớp với dữ liệu hợp lệ hay không.
 * Trả về true nếu cả hai trùng khớp, ngược lại trả về false.
 */
function kiemTraDangNhap(taiKhoan, matKhau) {
  const TAI_KHOAN_HOP_LE = 'admin';
  const MAT_KHAU_HOP_LE = '123456';

  if (taiKhoan === TAI_KHOAN_HOP_LE && matKhau === MAT_KHAU_HOP_LE) {
    return true;
  } else {
    return false;
  }
}

// Example usage:
console.log(kiemTraDangNhap('admin', '123456')); // true
console.log(kiemTraDangNhap('guest', 'password')); // false

module.exports = kiemTraDangNhap;
