import { CinemaSummaryByDate, FilmBeingShown } from "types";
import { NextFunction, Request, Response } from "express";
import { compareFilmScreenings } from "../helpers/compareFilmScreenings";
import { getCinemaSummariesFromFirestore } from "../helpers/getCinemaSummariesFromFirestore";

export const getScreeningsByDate = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { venues } = request.body;

    const multipleCinemaSummaryByDate: CinemaSummaryByDate = {};
    const cinemaSummaries = await getCinemaSummariesFromFirestore(venues);

    for (let i = 0; i < cinemaSummaries.length; i++) {
      for (const film of Object.keys(cinemaSummaries[i])) {
        cinemaSummaries[i][film].screenings.forEach(
          (unmappedScreening: any) => {
            const mappedScreening: FilmBeingShown = {
              ...cinemaSummaries[i][film],
              screenings: [
                {
                  ...unmappedScreening,
                  time: new Date(unmappedScreening.time.toDate())
                }
              ]
            };

            const dateOfScreening = mappedScreening.screenings[0].time;
            const dateOfScreeningString = dateOfScreening.toDateString();

            if (new Date() < dateOfScreening) {
              if (
                multipleCinemaSummaryByDate.hasOwnProperty(
                  dateOfScreeningString
                )
              ) {
                if (
                  multipleCinemaSummaryByDate[
                    dateOfScreeningString
                  ].hasOwnProperty(film)
                ) {
                  multipleCinemaSummaryByDate[dateOfScreeningString][
                    film
                  ].screenings = [
                    ...multipleCinemaSummaryByDate[dateOfScreeningString][film]
                      .screenings,
                    ...mappedScreening.screenings
                  ];
                } else {
                  multipleCinemaSummaryByDate[dateOfScreeningString][film] =
                    mappedScreening;
                }
              } else {
                multipleCinemaSummaryByDate[dateOfScreeningString] = {
                  [film]: mappedScreening
                };
              }
            }
          }
        );
      }
    }

    for (const date of Object.keys(multipleCinemaSummaryByDate)) {
      for (const film of Object.keys(multipleCinemaSummaryByDate[date])) {
        multipleCinemaSummaryByDate[date][film].screenings.sort(
          compareFilmScreenings
        );
      }
    }

    response.status(200).send(JSON.stringify(multipleCinemaSummaryByDate));
  } catch (error) {
    next(error.message);
  }
};
