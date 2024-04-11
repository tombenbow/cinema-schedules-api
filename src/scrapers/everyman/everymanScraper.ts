import fetch from "node-fetch";
import { isScreeningATheatreProduction } from "../genericHelpers/genericHelpers";
import { addTwoMonthsToDate, beginningOfDay } from "../../utility/dateUtility";
import { VenueNames } from "../../enums/venueNames";
import { EverymanVenueIds } from "../../enums/everymanVenueIds";
import { CinemaSummary, FilmScreening } from "types";
import { formatEverymanTitle } from "./everymanHelpers";

export const fetchEveryFilmShownAtEveryman = async () => {
  try {
    const response = await fetch(
      "https://cms-assets.webediamovies.pro/prod/everyman/660dab45b0d0ef3840683e7e/public/page-data/sq/d/517488378.json"
    );
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getFilmListingsAtEverymanVenue = async (
  arrayOfMovieIds: string[],
  everymanVenueId: EverymanVenueIds
) => {
  try {
    const response = await fetch(
      "https://www.everymancinema.com/api/gatsby-source-boxofficeapi/schedule",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: beginningOfDay(new Date()).toISOString(),
          to: addTwoMonthsToDate(new Date()).toISOString(),
          theaters: [
            {
              id: everymanVenueId,
              timeZone: "Europe/London"
            }
          ],
          websiteId:
            "V2Vic2l0ZU1hbmFnZXJXZWJzaXRlOmIyNWQwN2RkLTczYTYtNDg1Ny1iODAzLWZiMmMyM2NiYjFkYQ==",
          movieIds: arrayOfMovieIds
        })
      }
    );
    const data = await response.json();
    return data[Object.keys(data)[0]];
  } catch (error) {
    console.error("Error:", error);
  }
};

export const everymanScraper = async (
  url: string,
  venue: VenueNames
): Promise<CinemaSummary> => {
  const allFilmsAtEveryman = await fetchEveryFilmShownAtEveryman();
  let mappedEveryFilmAtEveryman: any = {};
  allFilmsAtEveryman.allMovie.nodes.forEach((movieListing: any) => {
    if (!isScreeningATheatreProduction(movieListing.title)) {
      mappedEveryFilmAtEveryman[movieListing.id] = {
        title: movieListing.title,
        rating: movieListing.certificate,
        description: movieListing.synopsis
      };
    }
  });

  const { schedule } = await getFilmListingsAtEverymanVenue(
    Object.keys(mappedEveryFilmAtEveryman),
    EverymanVenueIds[venue as keyof typeof EverymanVenueIds]
  );

  const cinemaSummary: CinemaSummary = {};

  for (const movieId of Object.keys(schedule)) {
    const mappedFilmScreenings: FilmScreening[] = [];

    Object.values(schedule[movieId]).forEach((dateFilmIsBeingShown: any) => {
      dateFilmIsBeingShown.forEach((screeningDescription: any) => {
        mappedFilmScreenings.push({
          time: new Date(screeningDescription.startsAt),
          venue_name: venue,
          link: screeningDescription.data.ticketing[0].urls[0]
        });
      });
    });

    const filmTitle = formatEverymanTitle(
      mappedEveryFilmAtEveryman[movieId].title
    );

    if (cinemaSummary.hasOwnProperty(filmTitle)) {
      cinemaSummary[filmTitle].screenings = [
        ...cinemaSummary[filmTitle].screenings,
        ...mappedFilmScreenings
      ];
    } else {
      cinemaSummary[filmTitle] = {
        description: mappedEveryFilmAtEveryman[movieId].description,
        rating: mappedEveryFilmAtEveryman[movieId].rating,
        screenings: mappedFilmScreenings
      };
    }
  }

  return cinemaSummary;
};
