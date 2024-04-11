import { VenueNames } from "../../enums/venueNames";
import { vueScraper } from "./vueScraper";

describe("vueScraper", () => {
  it("scrapes", async () => {
    const screening = await vueScraper(
      "https://www.myvue.com/cinema/cramlington/whats-on",
      VenueNames.CRAMLINGTON_VUE
    );
    console.log(JSON.stringify(screening));
  });
});
