const employees = [
  { name: "Tien",  dob: "1995-01-10", role: "DEV",  canDutyWeekend: true },
  { name: "An",    dob: "1997-03-12", role: "DEV",  canDutyWeekend: false },
  { name: "Hoa",   dob: "1996-11-22", role: "TEST", canDutyWeekend: true },
  { name: "Minh",  dob: "1998-07-01", role: "TEST", canDutyWeekend: false },
  { name: "Long",  dob: "1994-05-09", role: "DEV",  canDutyWeekend: true },
  { name: "Thao",  dob: "1999-02-14", role: "TEST", canDutyWeekend: true }
];

// 1. Lọc ra những nhân viên có role tuong ung với giá trị truyền vào
// const dev = employees.filter(
//   function(value){
//     return value.role === "DEV";
//   }
// );

// const test = employees.filter(
//   function(value){
//     return value.role === "TEST";
//   }
// );
  
// console.log(filterData("DEV"));
// console.log(filterData("TEST"));


// 2. kiem tra xem 1 ngay co phai cuoi tuan hay khong
// const now = "2025-12-13";

// function isWeekend(now) {
//  getDay có nghĩa là lấy ra ngày trong tuần từ 0-6 (0 là chủ nhật, 6 là thứ bảy)
//   const date = new Date(now).getDay();
//   return date === 0 || date === 6;
// }

// console.log(isWeekend(now));

// 3. Làm thế nào để xoay vòng danh sách trong mảng 
// Dùng shift()
function rotateArray(employees) {
  const firstElement = employees.shift(); // Lấy phần tử đầu tiên
  employees.push(firstElement); // Đẩy phần tử đó về cuối mảng

  return employees;
}

// 4. Lấy ra 7 ngày liên tiếp đưa vào mảng
function getNext7Days(startDate) {
  const result = [];
  const start = new Date(startDate);

  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(start);
    nextDate.setDate(start.getDate() + i);
    result.push(nextDate.toISOString().split('T')[0]); // Chuyển đổi về định dạng 'YYYY-MM-DD'
  }

  return result;
}

// 5. Viết function lịch trực 7 ngày sao cho: 
// Mỗi ngày có 1 dev và 1 test trực
// Ai có canDutyWeekend = false thì không được xếp trực vào cuối tuần
// Lịch phân chia đều, xoay vòng hợp lý
function generateDutySchedule(startDate, employees) {
  const schedule = [];
  const devs = employees.filter(emp => emp.role === "DEV");
  const tests = employees.filter(emp => emp.role === "TEST");
  const dates = getNext7Days(startDate);

  let devIndex = 0;
  let testIndex = 0;

  for (const date of dates) {
    const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;

    // Chọn DEV
    let dev;
    do {
      dev = devs[devIndex % devs.length];
      devIndex++;
    } while (isWeekend && !dev.canDutyWeekend);

    // Chọn TEST
    let test;
    do {
      test = tests[testIndex % tests.length];
      testIndex++;
    } while (isWeekend && !test.canDutyWeekend);

    schedule.push({
      date,
      dev: dev.name,
      test: test.name,
      canDutyWeekend: isWeekend
    });
  }

  return schedule;
}

// tuan 1
const rotatedEmployeesWeek1 = rotateArray(employees);
console.log(generateDutySchedule("2025-12-07", rotatedEmployeesWeek1));