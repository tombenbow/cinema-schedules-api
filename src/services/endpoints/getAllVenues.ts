import { NextFunction, Request, Response } from "express";
import { VenueNames } from "../../enums/venueNames";

export const getAllVenues = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.status(200).send(Object.values(VenueNames));
};
