import { expect } from '@playwright/test';
import { loginDefaults } from './login.js';

export async function createEmployee(api, payload) {
  const res = await api.post('/employees/', {
    // Multipart theo đúng API backend yêu cầu
    multipart: {
      employee: JSON.stringify({
        name: payload.name,
        mobilePhone: payload.phone,
        branchId: loginDefaults.branchId,
        tenantId: loginDefaults.tenantId,
        workBranchIds: [loginDefaults.branchId],
      }),
      payRate: JSON.stringify({ salaryPeriod: 1 }),
      debt: '0',
    },
  });

  const raw = await res.text();
  let body = JSON.parse(raw);

  const employeeId = body.result?.id;
  expect(employeeId, 'Không lấy được ID nhân viên sau khi tạo').toBeTruthy();
  return { employeeId, body };
}

export async function readEmployee(api, id) {
  // GET thông tin chi tiết nhân viên
  const res = await api.get(`/employees/${id}`);
  expect(res.status()).toBe(200);
  return res.json();
}

export async function updateEmployee(api, id, payload) {
  const employeeId = Number(id);
  const path = `/employees/${employeeId}`;

  // Đọc thông tin hiện tại để giữ lại các trường bắt buộc (code, payRate,...)
  const currentRes = await api.get(path, { timeout: 15000 });
  const currentData = await currentRes.json();
  const current = currentData.result ?? currentData;

  const res = await api.put(path, {
    timeout: 15000,
    // Multipart payload giống mẫu thực tế
    multipart: {
      employee: JSON.stringify({
        id: employeeId,
        code: current.code ?? '',
        name: payload.name,
        nickName: current.nickName ?? '',
        dob: current.dob ?? null,
        gender: current.gender ?? null,
        identityNumber: current.identityNumber ?? '',
        mobilePhone: payload.phone,
        email: current.email ?? '',
        facebook: current.facebook ?? '',
        address: current.address ?? '',
        LocationName: current.LocationName ?? '',
        WardName: current.WardName ?? '',
        note: current.note ?? '',
        branchId: loginDefaults.branchId,
        profilePictures: current.profilePictures ?? [],
        departmentId: current.departmentId ?? null,
        jobTitleId: current.jobTitleId ?? null,
        userId: current.userId ?? null,
        tenantId: loginDefaults.tenantId,
        temploc: current.temploc ?? '',
        tempw: current.tempw ?? '',
        workBranchIds: current.workBranchIds ?? [loginDefaults.branchId],
        identityKeyClocking: current.identityKeyClocking ?? null,
        startWorkingDate: current.startWorkingDate ?? null,
        newAddress: current.newAddress ?? null,
        AdministrativeAreaId: current.AdministrativeAreaId ?? null,
        isNotUpdateUserId: current.isNotUpdateUserId ?? false,
      }),
      payRate: JSON.stringify({
        salaryPeriod: current.payRate?.salaryPeriod ?? 1,
        payRateTemplateId: current.payRateTemplateId ?? current.payRateId ?? 0,
        mainSalaryRuleValue: current.payRate?.mainSalaryRuleValue ?? null,
        overtimeSalaryRuleValue: current.payRate?.overtimeSalaryRuleValue ?? null,
        commissionSalaryRuleValue: current.payRate?.commissionSalaryRuleValue ?? null,
        bonusSalaryRuleValue: current.payRate?.bonusSalaryRuleValue ?? null,
        allowanceRuleValue: current.payRate?.allowanceRuleValue ?? null,
        deductionRuleValue: current.payRate?.deductionRuleValue ?? { deductionRuleValueDetails: [] },
      }),
      debt: String(current.debt ?? 0),
    },
  });

  const raw = await res.text();

  return JSON.parse(raw);
}

export async function deleteEmployee(api, id) {
  // Xóa nhân viên theo ID
  const res = await api.delete(`/employees/${id}`);
  expect(res.ok()).toBeTruthy();
}

export async function stopWorking(api, id, deactivateUser = false) {
  const employeeId = Number(id);
  const res = await api.put('/employees/stop-working', {
    timeout: 15000,
    multipart: {
      id: String(employeeId),
      deactivateUser: String(deactivateUser),
    },
  });
  const raw = await res.text();
  
  return JSON.parse(raw);
}
