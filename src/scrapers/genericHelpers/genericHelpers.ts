export const isScreeningATheatreProduction = (title: string) => {
  const prefixesToExclude = [
    "National Theatre Live: ",
    "ROH Live: ",
    "Met Opera: ",
    "Royal Ballet ",
    "2024 Royal Ballet",
    "NT Live: ",
    "The Royal Opera ",
    "Royal Opera ",
    "2024 Royal Opera",
    "Exhibition On Screen: "
  ];

  for (const prefix of prefixesToExclude) {
    if (title.startsWith(prefix)) {
      return true;
    }
  }

  return false;
};
