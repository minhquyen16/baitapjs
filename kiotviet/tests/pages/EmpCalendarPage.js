import { BasePage } from './BasePage';

export class EmpCalendarPage extends BasePage {
    constructor(page) {
        super(page);
    }

    /**
     * Chọn kiểu hiển thị từ dropdown
     * @param {string} typeName - Tên kiểu hiển thị cần chọn (ví dụ: 'Xem theo ca')
     */
    async selectViewType(typeName) {
        // Sử dụng locator cụ thể hơn nếu có thể, hoặc đợi dropdown hiển thị đúng cách
        const dropdown = this.page.locator('kendo-dropdownlist');
        await dropdown.waitFor({ state: 'visible' });
        
        // Force click để bỏ qua các vấn đề overlay tiềm ẩn (ví dụ: toast messages, modal đang ẩn dần)
        await dropdown.click({ force: true });
        
        // Đợi danh sách mở ra
        const listContent = this.page.locator('.k-animation-container-shown'); // Kendo thường dùng class này cho dropdown đang mở
        await listContent.waitFor({ state: 'visible' });

        // Chọn option theo role và tên
        await this.page.getByRole('option', { name: typeName }).click();
    }
}
