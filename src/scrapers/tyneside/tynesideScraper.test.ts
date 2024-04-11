import { VenueNames } from "../../enums/venueNames";
import { tynesideScraper } from "./tynesideScraper";

describe("tynesideScraper", () => {
  it("scrapes", async () => {
    const allScreenings = await tynesideScraper(
      "https://tynesidecinema.co.uk",
      VenueNames.TYNESIDE_CINEMA
    );
    console.log(JSON.stringify(allScreenings));
  });
});
