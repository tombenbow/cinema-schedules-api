import { ScraperFunction } from "types";
import { vueScraper } from "../../scrapers/vue/vueScraper";
import { tynesideScraper } from "../../scrapers/tyneside/tynesideScraper";
import { odeonScraper } from "../../scrapers/odeon/odeonScraper";
import { everymanScraper } from "../../scrapers/everyman/everymanScraper";
import { cineworldScraper } from "../../scrapers/cineworld/cineworldScraper";
import { VenueNames } from "../../enums/venueNames";

export const arrayOfScrapers: {
  url: string;
  venue: VenueNames;
  scraper: ScraperFunction;
}[] = [
  {
    url: "https://www.myvue.com/cinema/gateshead/whats-on",
    venue: VenueNames.GATESHEAD_VUE,
    scraper: vueScraper
  },
  {
    url: "https://www.myvue.com/cinema/cramlington/whats-on",
    venue: VenueNames.CRAMLINGTON_VUE,
    scraper: vueScraper
  },
  {
    url: "https://tynesidecinema.co.uk",
    venue: VenueNames.TYNESIDE_CINEMA,
    scraper: tynesideScraper
  },
  {
    url: "https://www.odeon.co.uk/cinemas/silverlink/",
    venue: VenueNames.ODEON_SILVERLINK,
    scraper: odeonScraper
  },
  {
    url: "https://www.odeon.co.uk/cinemas/metrocentre/",
    venue: VenueNames.ODEON_METROCENTRE,
    scraper: odeonScraper
  },
  {
    url: "https://www.everymancinema.com/venues-list/x11kb-everyman-newcastle/",
    venue: VenueNames.EVERYMAN_NEWCASTLE,
    scraper: everymanScraper
  },
  {
    url: "https://www.cineworld.co.uk/cinemas/newcastle-upon-tyne/105#/buy-tickets-by-cinema?in-cinema=105&at=",
    venue: VenueNames.CINEWORLD_NEWCASTLE,
    scraper: cineworldScraper
  },
  {
    url: "https://www.cineworld.co.uk/cinemas/boldon-tyne-and-wear/024#/buy-tickets-by-cinema?in-cinema=024&at=",
    venue: VenueNames.CINEWORLD_BOLDON,
    scraper: cineworldScraper
  }
];
