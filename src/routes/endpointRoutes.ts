import { Express } from "express";
import { getAllVenues } from "../services/endpoints/getAllVenues";
import { getAllScreenings } from "../services/endpoints/getAllScreenings";
import { getScreeningsByDate } from "../services/endpoints/getScreeningsByDate";

export const endpointRoutes = (app: Express) => {
  app.route("/available-cinemas").get(getAllVenues);
  app.route("/cinema-listings-between-dates").post(getAllScreenings);
  app.route("/cinema-listings-by-date").post(getScreeningsByDate);
};
