import express from "express";
import helmet from "helmet";
import cors from "cors";

import { connectProviders } from "./config/connectProviders";
import { endpointRoutes } from "./routes/endpointRoutes";
import { scraperRoutes } from "./routes/scraperRoutes";
import { unavailableRoutes } from "./routes/unavailableRoutes";

const app = express();
const port = 3001;

connectProviders()
  .then(async () => {
    app.use(
      helmet({
        crossOriginResourcePolicy: false
      })
    );
    app.use(cors());
    app.use("/static", express.static("public"));

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    endpointRoutes(app);
    scraperRoutes(app);
    unavailableRoutes(app);

    app.listen(port, () => {
      console.log(`Cinema Viewer is awake on port ${port} 🏄‍♂️`);
    });
  })
  .catch((error) => {
    console.error(error);
    return error.message;
  });
