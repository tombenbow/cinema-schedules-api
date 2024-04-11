export const getComingDaysInDDMMYYYYFormat = (
  numberOfDaysToGetDatesFor: number
) => {
  const today = new Date();
  const comingDays = [];

  for (let i = 0; i < numberOfDaysToGetDatesFor; i++) {
    const currentDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();

    const dateString = `${day}-${month}-${year}`;
    comingDays.push(dateString);
  }

  return comingDays;
};

export const buildDateObjectFromTynesideDateStrings = (
  dayString: string,
  timeString: string
) => {
  // Parse date string in the format "31-01-2024"
  const [day, month, year] = dayString.split("-");
  const dateObject = new Date(`${year}-${month}-${day}`);

  // Parse time string in the format "17:30"
  const [hours, minutes] = timeString.split(":");
  dateObject.setHours(parseInt(hours));
  dateObject.setMinutes(parseFloat(minutes));

  return dateObject;
};
