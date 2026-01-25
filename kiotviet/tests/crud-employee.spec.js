import { test, expect } from '@playwright/test';
import { createApiClients } from './api/client.js';
import {
  createEmployee,
  readEmployee,
  updateEmployee,
  deleteEmployee,
  stopWorking,
} from './api/employees.js';
import { randomName, randomPhone } from './api/data.js';

test.describe('CRUD nhân viên qua API', () => {
  test.describe.configure({ mode: 'serial' });

  let timesheetApi;
  let salonApi;
  let employeeId = null;
  const baseEmployee = {
    name: randomName(),
    phone: randomPhone(),
  };

  test.beforeAll(async () => {
    // Chuẩn bị 2 context API (timesheet + salon) sau khi login
    const clients = await createApiClients();
    timesheetApi = clients.timesheetApi;
    salonApi = clients.salonApi;
  });

  test.afterAll(async () => {
    await timesheetApi?.dispose();
    await salonApi?.dispose();
  });

  test('Create employee', async () => {
    // Tạo nhân viên mới (dùng timesheet API để tránh trả HTML)
    const created = await createEmployee(timesheetApi, baseEmployee);
    employeeId = created.employeeId;

    // Đọc lại thông tin
    const employeeData = await readEmployee(timesheetApi, employeeId);
    expect(employeeData.result.name).toBe(baseEmployee.name);
    expect(employeeData.result.mobilePhone).toBe(baseEmployee.phone);
  });

  test('Update employee', async () => {
    // Cập nhật tên/số điện thoại ngẫu nhiên và kiểm tra lại
    const updated = {
      name: randomName(),
      phone: randomPhone(),
    };

    await updateEmployee(timesheetApi, employeeId, updated);
    const updatedData = await readEmployee(timesheetApi, employeeId);
    expect(updatedData.result.name).toBe(updated.name);
    expect(updatedData.result.mobilePhone).toBe(updated.phone);
  });

  test('Stop working employee', async () => {
    await stopWorking(timesheetApi, employeeId, false);
  });

  test('Delete employee', async () => {
    await deleteEmployee(timesheetApi, employeeId);
  });
});
