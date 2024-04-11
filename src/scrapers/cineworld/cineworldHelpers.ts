import { FilmRating } from "types";
import {
  monthMapDoubleDigit,
  monthMapSingleDigit
} from "../../enums/dateEnums";

export const getRatingFromCineworldLink = (link: string): FilmRating => {
  switch (link) {
    case "https://www.cineworld.co.uk/xmedia/img/10108/rating/U.png":
      return "U";

    case "https://www.cineworld.co.uk/xmedia/img/10108/rating/PG.png":
      return "PG";

    case "https://www.cineworld.co.uk/xmedia/img/10108/rating/12A.png":
      return "12A";

    // ToDo: Add case for the 12 rating once you have the correct link
    case "linkTo12Image":
      return "12";

    case "https://www.cineworld.co.uk/xmedia/img/10108/rating/15.png":
      return "15";

    case "https://www.cineworld.co.uk/xmedia/img/10108/rating/18.png":
      return "18";

    case "https://www.cineworld.co.uk/xmedia/img/10108/rating/TBC.png":
      return "TBC";

    default:
      return "N/A";
  }
};

export const checkIfCineworldScreeningIsInHourFormat = (
  screeningTime: string
): boolean => {
  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  return timeRegex.test(screeningTime);
};

export const buildDateObjectFromCineworldElements = (
  day: string,
  timeOfDay: string
): Date => {
  const dayComponents = day.split(" ");
  const dayNumber = parseInt(dayComponents[0], 10);
  const monthName = dayComponents[1];
  const year = parseInt(dayComponents[2], 10);

  const month =
    monthMapSingleDigit[monthName as keyof typeof monthMapSingleDigit];

  const [hours, minutes] = timeOfDay.split(":");

  const dateObject = new Date(
    year,
    month,
    dayNumber,
    parseFloat(hours),
    parseFloat(minutes)
  );

  return dateObject;
};

export const buildYYYYMMDDFromCineworldDay = (dateString: string): string => {
  const [day, month, year] = dateString.match(/\d+|[a-zA-Z]+/g);
  const formattedMonth =
    monthMapDoubleDigit[month as keyof typeof monthMapDoubleDigit];
  const formattedDay = day.padStart(2, "0");

  return `${year}-${formattedMonth}-${formattedDay}`;
};

export const buildYYYYMMDDFromCurrentDate = () => {
  const currentDate = new Date();

  // Extract year, month, and day components
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are zero-indexed
  const day = currentDate.getDate().toString().padStart(2, "0");

  // Construct the date string
  return `${year}-${month}-${day}`;
};

export const buildCineworldUrlFromDate = (
  currentUrl: string,
  dateString: string
): string => {
  const formattedDateString = buildYYYYMMDDFromCineworldDay(dateString);
  const updatedUrl = currentUrl.replace(
    /\b\d{4}-\d{2}-\d{2}\b/,
    formattedDateString
  );
  return updatedUrl;
};

export const formatCineworldTitle = (inputString: string): string => {
  const seasonIndex = inputString.indexOf("Season: ");
  if (seasonIndex !== -1) {
    inputString = inputString.substring(seasonIndex + "Season: ".length);
  }

  const seasonIndex2 = inputString.indexOf("Season : ");
  if (seasonIndex2 !== -1) {
    inputString = inputString.substring(seasonIndex2 + "Season: ".length);
  }

  const unlimitedIndex = inputString.indexOf("Unlimited Screening");
  if (unlimitedIndex !== -1) {
    inputString = inputString.substring(0, unlimitedIndex).trim();
  }

  return inputString.trim();
};
