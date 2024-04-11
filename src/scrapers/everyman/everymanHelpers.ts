import { monthMapSingleDigit } from "../../enums/dateEnums";

export const formatEverymanTitle = (title: string): string => {
  const prefixesToRemove = [
    "Throwback: ",
    "Late Nights: ",
    "Late Night: ",
    "Toddler Club: ",
    "Members' Preview: "
  ];

  for (const prefix of prefixesToRemove) {
    if (title.startsWith(prefix)) {
      return title.substring(prefix.length).trim();
    }
  }

  return title.trim();
};

export const buildDateObjectFromEverymanCalendar = (
  monthAndYearString: string,
  dayString: string
): Date => {
  return new Date(`${dayString} ${monthAndYearString}`);
};

export const buildDateObjectFromEverymanScreening = (
  hourString: string,
  monthAndYearString: string,
  dayString: string
): Date => {
  const [hour, minute] = hourString.split(":").map(Number);
  const [month, year] = monthAndYearString.split(" ");

  const date = new Date(
    Number(year),
    monthMapSingleDigit[month as keyof typeof monthMapSingleDigit],
    Number(dayString),
    hour,
    minute
  );

  return date;
};
