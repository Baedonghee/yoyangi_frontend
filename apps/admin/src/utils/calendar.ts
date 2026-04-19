import { addDays, endOfMonth, startOfDay, startOfMonth, startOfWeek } from 'date-fns';

// 한주 배열 반환
function takeWeek(start = new Date()) {
  let date = startOfWeek(startOfDay(start), { weekStartsOn: 0 }); // Change weekStartsOn to 0 for Sunday.

  return function () {
    const week = [...Array(7)].map((_, index) => {
      const day = addDays(date, index);
      return day;
    });
    date = addDays(week[6], 1);
    return week;
  };
}

// 한달 배열 반환
export function takeMonth(start = new Date()) {
  let month = [] as any;
  let date = start;

  return function (): [Date[]] {
    const weekGen = takeWeek(startOfMonth(date));
    const endDate = startOfDay(endOfMonth(date));
    month.push(weekGen());

    while (lastDayOfRange(month) < endDate) {
      month.push(weekGen());
    }

    const range = month;
    month = [];
    date = addDays(lastDayOfRange(range), 1);

    return range;
  };
}

// 일주일 범위 지정
function lastDayOfRange(range: any) {
  return range[range.length - 1][6];
}
