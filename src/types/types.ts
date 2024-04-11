import { VenueNames } from "../enums/venueNames";

export type FilmRating =
  | "TBC"
  | "U"
  | "PG"
  | "12A"
  | "12"
  | "15"
  | "18"
  | "N/A";

export interface FilmScreening {
  time: Date;
  link: string;
  venue_name: string;
}

export interface FilmBeingShown {
  description: string | null;
  rating: FilmRating;
  screenings: FilmScreening[];
}

export interface FilmBeingShownWithTitle {
  title: string;
  description: string | null;
  rating: FilmRating;
  screenings: FilmScreening[];
}

export interface CinemaSummary {
  [key: string]: FilmBeingShown;
}

export interface CinemaSummaryByDate {
  [key: string]: CinemaSummary;
}

export interface MappedCinemaSummaryByDate {
  date: string;
  films: FilmBeingShownWithTitle[];
}[]

export type ScraperFunction = (
  url: string,
  venue: VenueNames
) => Promise<CinemaSummary>;
