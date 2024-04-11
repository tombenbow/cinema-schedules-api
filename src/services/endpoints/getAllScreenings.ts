import { NextFunction, Request, Response } from "express";
import { CinemaSummary, FilmBeingShown } from "types";
import { getCinemaSummariesFromFirestore } from "../helpers/getCinemaSummariesFromFirestore";

export const getAllScreenings = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { venues } = request.body;

    const multipleCinemaSummary: CinemaSummary = {};
    const cinemaSummaries = await getCinemaSummariesFromFirestore(venues);

    for (let i = 0; i < cinemaSummaries.length; i++) {
      for (const film of Object.keys(cinemaSummaries[i])) {
        const mappedFilm: FilmBeingShown = {
          ...cinemaSummaries[i][film],
          screenings: cinemaSummaries[i][film].screenings
            .map((unmappedScreening: any) => {
              const formattedScreeningTime: Date = new Date(
                unmappedScreening.time.toDate()
              );

              if (new Date() < formattedScreeningTime) {
                return {
                  ...unmappedScreening,
                  time: formattedScreeningTime
                };
              }
            })
            .filter((screening) => screening !== undefined)
        };

        if (mappedFilm.screenings.length > 0) {
          if (multipleCinemaSummary.hasOwnProperty(film)) {
            multipleCinemaSummary[film].screenings = [
              ...multipleCinemaSummary[film].screenings,
              ...mappedFilm.screenings
            ];
          } else {
            multipleCinemaSummary[film] = mappedFilm;
          }
        }
      }
    }

    response.status(200).send(JSON.stringify(multipleCinemaSummary));
  } catch (error) {
    next(error.message);
  }
};
