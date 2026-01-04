import { APIRequestContext, expect } from '@playwright/test';
import { loginDefaults } from './login';

export type EmployeePayload = { name: string; phone: string };

export async function createEmployee(api: APIRequestContext, payload: EmployeePayload) {
  // Gọi API tạo nhân viên bằng multipart (theo mẫu thực tế)
  const res = await api.post('/employees/', {
    multipart: {
      employee: JSON.stringify({
        id: 0,
        code: '',
        name: payload.name,
        nickName: '',
        dob: null,
        gender: null,
        identityNumber: null,
        mobilePhone: payload.phone,
        email: null,
        facebook: null,
        address: null,
        LocationName: '',
        WardName: '',
        note: null,
        branchId: loginDefaults.branchId,
        profilePictures: [],
        departmentId: null,
        jobTitleId: null,
        userId: null,
        tenantId: loginDefaults.tenantId,
        temploc: '',
        tempw: '',
        workBranchIds: [loginDefaults.branchId],
        identityKeyClocking: null,
        startWorkingDate: null,
        newAddress: null,
        AdministrativeAreaId: null,
        isNotUpdateUserId: false,
      }),
      payRate: JSON.stringify({
        salaryPeriod: 1,
        payRateTemplateId: null,
        mainSalaryRuleValue: null,
        overtimeSalaryRuleValue: null,
        commissionSalaryRuleValue: null,
        bonusSalaryRuleValue: null,
        allowanceRuleValue: null,
        deductionRuleValue: { deductionRuleValueDetails: [] },
      }),
      debt: '0',
    },
  });

  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  const employeeId = body.result?.id;
  expect(employeeId, 'Không lấy được ID nhân viên sau khi tạo').toBeTruthy();
  return { employeeId, body };
}

export async function readEmployee(api: APIRequestContext, id: number | string) {
  const res = await api.get(`/employees/${id}`);
  expect(res.status()).toBe(200);
  return res.json();
}

export async function deleteEmployee(api: APIRequestContext, id: number | string) {
  const res = await api.delete(`/employees/${id}`);
  expect(res.ok()).toBeTruthy();
  return res;
}
