import { Express, NextFunction, Request, Response } from "express";

const handleUnavailableRoutes = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: "Not Found" });
  };
};

export const unavailableRoutes = (app: Express) => {
  app.route("*").all(handleUnavailableRoutes);
};
