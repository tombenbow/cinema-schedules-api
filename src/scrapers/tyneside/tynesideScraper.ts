import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import {
  buildDateObjectFromTynesideDateStrings,
  getComingDaysInDDMMYYYYFormat
} from "./tynesideHelpers";
import { CinemaSummary, FilmScreening, ScraperFunction } from "types";
import { isScreeningATheatreProduction } from "../genericHelpers/genericHelpers";
import { VenueNames } from "../../enums/venueNames";

puppeteer.use(stealthPlugin());

export const tynesideScraper: ScraperFunction = async (
  url: string,
  venue: VenueNames
): Promise<CinemaSummary> => {
  const browser = await puppeteer.launch({ headless: "new" });
  const webPage = await browser.newPage();

  const incompleteAllFilmsAtCinema: any = {};

  const comingDays = getComingDaysInDDMMYYYYFormat(90);
  let latestScreening = new Date();

  for (const day of comingDays) {
    const extendedURL = `${url}/whats-on/date/${day}`;
    await webPage.goto(extendedURL);
    const filmsOnPage = await webPage.$$(
      ".item.event-item.col-12.col-sm-6.col-lg-3"
    );
    for (const film of filmsOnPage) {
      //GET THE FILM TITLE
      const title = await film.$eval("article.item h3", (h3Element) =>
        h3Element.textContent.trim()
      );

      if (!isScreeningATheatreProduction(title)) {
        //GET THE LINK TO WHERE THE FILM RATING AND DESCRIPTION ARE
        const linkToEventDescription = await film.$eval(
          ".item.event-item a",
          (anchor) => anchor.getAttribute("href")
        );

        //GET THE SCREENING TIMES AND LINKS
        const screeningElements = await film.$$(
          ".inst.available, .inst.last-few"
        );

        const screenings: FilmScreening[] = await Promise.all(
          screeningElements.map(async (element) => {
            const timeOfDay = await element
              .$eval("span.instance-time", (span) => span.textContent.trim())
              .catch(() => null); // Catch potential errors in case the span is not found or other issues

            const time = buildDateObjectFromTynesideDateStrings(day, timeOfDay);
            if (time > latestScreening) {
              latestScreening = time;
            }

            const linkQSP = await element
              .evaluate((el) => el.getAttribute("href"))
              .catch(() => null);
            const link = `${url}/${linkQSP}`;

            return { time, link, venue_name: venue };
          })
        );

        if (incompleteAllFilmsAtCinema.hasOwnProperty(title)) {
          incompleteAllFilmsAtCinema[title].screenings = [
            ...incompleteAllFilmsAtCinema[title].screenings,
            ...screenings
          ];
        } else {
          incompleteAllFilmsAtCinema[title] = {
            linkToEventDescription,
            screenings
          };
        }
      }
    }
  }

  const completedAllFilmsAtCinema: CinemaSummary = {};

  for (const filmTitle of Object.keys(incompleteAllFilmsAtCinema)) {
    const descriptionUrl =
      incompleteAllFilmsAtCinema[filmTitle].linkToEventDescription;
      
    await webPage.goto(descriptionUrl);

    await webPage.waitForTimeout(1000);

    const description = await webPage.$eval(
      ".introduction > p:nth-child(2), .entry",
      (element) => element.textContent.trim()
    );

    const rating = await webPage.$eval(".age-rating", (element) =>
      element.textContent.trim()
    );

    completedAllFilmsAtCinema[filmTitle] = {
      rating,
      description,
      screenings: incompleteAllFilmsAtCinema[filmTitle].screenings
    };
  }

  await browser.close();

  return completedAllFilmsAtCinema;
};
