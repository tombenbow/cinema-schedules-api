import { VenueNames } from "../../enums/venueNames";
import { odeonScraper } from "./odeonScraper";

describe("odeonScraper", () => {
  it("scrapes", async () => {
    const films = await odeonScraper(
      "https://www.odeon.co.uk/cinemas/metrocentre/",
      VenueNames.ODEON_METROCENTRE
    );
    console.log(JSON.stringify(films));
  });
});
