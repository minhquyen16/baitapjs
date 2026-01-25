
export class BasePage {
    constructor(page) {
        this.page = page;
    }

    /**
     * Hàm hỗ trợ chọn radio button theo nhãn bên trong locator chứa
     * @param {Locator} locator - Locator chứa
     * @param {string} label - Nhãn của radio button
     */
    async doSelectRadio(locator, label) {
        const radio = locator.locator('label.kv-form-check', { hasText: label });
        // Playwright tự động đợi, nên ta chỉ cần click.
        // Nếu cần kiểm tra tồn tại trước để tránh lỗi nếu thiếu:
        if (await radio.isVisible()) {
            await radio.click();
        }
    }
}
