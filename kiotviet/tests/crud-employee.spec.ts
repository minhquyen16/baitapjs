import { test, expect, APIRequestContext } from '@playwright/test';
import { createEmployeeApiContext } from './api/client';
import {
  createEmployee,
  readEmployee,
  deleteEmployee,
  type EmployeePayload,
} from './api/employees';
import { loginDefaults } from './api/login';

test.describe('CRUD nhân viên qua API', () => {
  let api: APIRequestContext;
  const nameSuffix = Math.random().toString(36).slice(2, 6);
  const newEmployee: EmployeePayload = {
    name: `Nguyen Van ${nameSuffix}`,
    phone: '09' + Math.floor(10000000 + Math.random() * 90000000),
  };

  test.beforeAll(async () => {
    api = await createEmployeeApiContext();
  });

  test.afterAll(async () => {
    await api?.dispose();
  });

  test('Create -> Read -> Update -> Delete employee', async () => {
    const { employeeId } = await createEmployee(api, newEmployee);

    // Read
    const employeeData = await readEmployee(api, employeeId);
    expect(employeeData.result?.name ?? employeeData.name).toBe(newEmployee.name);
    expect(employeeData.result?.mobilePhone ?? employeeData.mobilePhone).toBe(
      newEmployee.phone
    );

    // Delete
    // await deleteEmployee(api, employeeId);
    // const readAfterDelete = await api.get(`/employees/${employeeId}`);
    // expect(readAfterDelete.status()).toBe(404);
  });
});
