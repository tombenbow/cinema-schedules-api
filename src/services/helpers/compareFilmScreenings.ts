import { FilmScreening } from "types";

export const compareFilmScreenings = (
  filmScreening1: FilmScreening,
  filmScreening2: FilmScreening
) => {
  if (filmScreening1.time < filmScreening2.time) {
    return -1;
  } else if (filmScreening1.time > filmScreening2.time) {
    return 1;
  } else {
    return 0;
  }
};
