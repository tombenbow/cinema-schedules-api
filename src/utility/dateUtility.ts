export const midnightYesterday = (): Date => {
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return yesterday;
};

export const midnightOneYearFromNow = (): Date => {
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  oneYearFromNow.setHours(0, 0, 0, 0);
  return oneYearFromNow;
};

export const addTwoMonthsToDate = (date: Date): Date => {
  const dateWithTwoMonthsAdded = new Date(
    date.getFullYear(),
    date.getMonth() + 3,
    date.getDate()
  );
  return dateWithTwoMonthsAdded;
};

export const endOfDay = (day: Date): Date => {
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    23,
    59,
    59,
    999
  );
};

export const beginningOfDay = (day: Date): Date => {
  day.setUTCHours(0);
  day.setUTCMinutes(0);
  day.setUTCSeconds(0);
  day.setUTCMilliseconds(0);

  return day;
};


