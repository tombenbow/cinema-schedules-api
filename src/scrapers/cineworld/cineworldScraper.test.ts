import { VenueNames } from "../../enums/venueNames";
import { cineworldScraper } from "./cineworldScraper";

describe("cineworldScraper", () => {
  it("scrapes whole cinema", async () => {
    const allFilms = await cineworldScraper(
      "https://www.cineworld.co.uk/cinemas/boldon-tyne-and-wear/024#/buy-tickets-by-cinema?in-cinema=024&at=",
      VenueNames.CINEWORLD_BOLDON
    );
    console.log(JSON.stringify(allFilms));
  });
});
