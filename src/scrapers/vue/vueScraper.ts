import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { CinemaSummary, FilmScreening, ScraperFunction } from "types";
import {
  buildDateObjectFromVueElements,
  getRatingFromVueLink
} from "./vueHelpers";
import { isScreeningATheatreProduction } from "../genericHelpers/genericHelpers";
import { VenueNames } from "../../enums/venueNames";

puppeteer.use(stealthPlugin());

//NOTE: IF THIS WEBSCRAPER BECOMES PROBLEMATIC, THE API IS GOOD
export const vueScraper: ScraperFunction = async (
  url: string,
  venue: VenueNames
): Promise<CinemaSummary> => {
  const browser = await puppeteer.launch({
    headless: "new"
  });

  //GO TO WEBPAGE
  const webPage = await browser.newPage();
  await webPage.setViewport({
    width: 1200,
    height: 800
  });
  await webPage.goto(url);
  await webPage.waitForTimeout(1000);

  //REJECT COOKIES
  const rejectCookiesButton = await webPage.waitForSelector(
    "button#onetrust-reject-all-handler"
  );
  await rejectCookiesButton.click();
  await webPage.waitForTimeout(2000);

  //GO TO 'ALL TIMES' PAGE WHICH SHOWS ALL FILMS THEY PLAN TO SCREEN IN THE FUTURE
  const viewScreeningsForAllDaysButton = await webPage.waitForSelector(
    'button[data-day="All times"], button[data-test="filters-day-All Times"]'
  );

  await viewScreeningsForAllDaysButton.click();

  await webPage.waitForTimeout(2000);

  let allFilmsAtCinema: CinemaSummary = {};

  //ITERATE OVER ALL FILMS ON THE PAGE
  const filmsOnPage = await webPage.$$(".showing-listing__item");
  for (const film of filmsOnPage) {
    const title = await film.$eval(
      ".film-heading__title",
      (titleElement: any) => titleElement.textContent
    );

    if (!isScreeningATheatreProduction(title)) {
      const description = await film.$eval(
        ".description",
        (descriptionElement: any) => descriptionElement.textContent
      );

      const linkToRatingCertificateImg = await film.$$eval(
        'img[alt="certificate label"]',
        (img) => {
          return img[0].src;
        }
      );
      const rating = getRatingFromVueLink(linkToRatingCertificateImg);

      //CLICK BUTTON TO SEE ALL SCREENINGS FOR FILM
      const showAllTimesForFilmButton = await film.waitForSelector(
        ".sessions__open-close__button"
      );
      await showAllTimesForFilmButton.click();

      const screenings: FilmScreening[] = [];

      //ITERATE OVER THE 'ROWS' OF SCREENINGS. A ROW CONTAINS ALL SCREENINGS FOR A FILM ON ONE PATICULAR DAY
      await film.waitForSelector(".sessions__group-list__item");
      const rowsOfShowtimeButtons = await film.$$(
        ".sessions__group-list__item"
      );

      for (const row of rowsOfShowtimeButtons) {
        const dateOfAllShowtimesInRow = await row.$$eval(
          ".sessions__group-block",
          (timeElements: any) => {
            return timeElements[0].getAttribute("data-test");
          }
        );

        const showtimeButtonsInRow = await row.$$(".sessions__list__item");

        //ITERATE OVER THE SCREENINGS THAT ARE IN THAT ROW
        for (const showtimeButton of showtimeButtonsInRow) {
          const timeOfDay = await showtimeButton.$$eval(
            ".session__time__start",
            (timeElements: any) => {
              return timeElements[0].getAttribute("datetime");
            }
          );

          const link = await showtimeButton.$$eval(
            ".session",
            (linkElements: any) => {
              return linkElements[0].getAttribute("href");
            }
          );
          screenings.push({
            time: buildDateObjectFromVueElements(
              dateOfAllShowtimesInRow,
              timeOfDay
            ),
            link: `https://www.myvue.com/${link}`,
            venue_name: venue
          });
        }
      }

      allFilmsAtCinema[title] = {
        description,
        rating,
        screenings
      };
      await webPage.waitForTimeout(100);
    }
  }

  await browser.close();

  return allFilmsAtCinema;
};
