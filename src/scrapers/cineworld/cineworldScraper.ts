import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { CinemaSummary, FilmScreening } from "types";
import {
  buildDateObjectFromCineworldElements,
  buildYYYYMMDDFromCineworldDay,
  buildYYYYMMDDFromCurrentDate,
  checkIfCineworldScreeningIsInHourFormat,
  formatCineworldTitle,
  getRatingFromCineworldLink
} from "./cineworldHelpers";
import { Page } from "puppeteer";
import { isScreeningATheatreProduction } from "../genericHelpers/genericHelpers";
import fs from "fs";
import { VenueNames } from "../../enums/venueNames";

puppeteer.use(stealthPlugin());

const getDatesWhenFilmsAreShown = async (webPage: Page): Promise<string[]> => {
  let datesWhenFilmsAreShown: string[] = [];

  //CLICK BUTTON TO OPEN CALENDAR
  const openCalendarButton = await webPage.$(
    'button[aria-label="Pick a date"]'
  );

  await openCalendarButton.click();
  // await webPage.waitForSelector(".day.active.selected");
  // const ariaLabelForSelectedDay = await webPage.$$eval(
  //   ".day.active.selected button",
  //   (buttons) => buttons.map((button) => button.getAttribute("aria-label"))
  // );
  // datesWhenFilmsAreShown = [
  //  // ...datesWhenFilmsAreShown,
  //   ...ariaLabelForSelectedDay
  // ];
  await webPage.waitForTimeout(2000);

  for (let i = 0; i < 3; i++) {
    await webPage.waitForSelector(".day.active");

    const ariaLabelsForUnselectedDays = await webPage.$$eval(
      ".day.active button",
      (buttons) => buttons.map((button) => button.getAttribute("aria-label"))
    );

    datesWhenFilmsAreShown = [
      ...datesWhenFilmsAreShown,
      ...ariaLabelsForUnselectedDays
    ];

    await webPage.click('button[aria-label="next"]');
    await webPage.waitForTimeout(2000);
  }
  return datesWhenFilmsAreShown;
};

const scrapeIndividualCineworldPage = async (
  allFilmsAtCinema: CinemaSummary,
  webPage: Page,
  venue: VenueNames,
  cineworldUrl: string,
  day: string
) => {
  //GO TO PAGE
  await webPage.goto(cineworldUrl);
  await webPage.reload();
  await webPage.waitForTimeout(1000);

  //ITERATE OVER ALL FILMS ON PAGE
  const filmsOnPage = await webPage.$$(".row.qb-movie");
  for (const film of filmsOnPage) {
    //GET THE FILM SCREENINGS & LINKS FOR BOOKING
    const rawScreenings = await film.$$eval(
      ".btn.btn-primary.btn-lg",
      (spans) =>
        spans.map((span) => ({
          link: span.getAttribute("data-url"),
          timeOfDay: span.textContent.trim()
        }))
    );

    if (!checkIfCineworldScreeningIsInHourFormat(rawScreenings[0].timeOfDay)) {
      break;
    }

    const mappedScreenings: FilmScreening[] = rawScreenings.map(
      ({ link, timeOfDay }) => ({
        link,
        time: buildDateObjectFromCineworldElements(day, timeOfDay),
        venue_name: venue
      })
    );

    //GET THE FILM TITLE
    const unformattedTitle = await film.$eval(
      ".movie-poster-container img",
      (img) => img.alt
    );

    const title = formatCineworldTitle(unformattedTitle);

    if (!isScreeningATheatreProduction(title)) {
      //GET THE FILM RATING
      const linkToRatingImg = await film.$$eval(".rating-icon", (img) => {
        return img[0].src;
      });
      const rating = getRatingFromCineworldLink(linkToRatingImg);

      //ADD FILM SCREENINGS TO OVERALL SUMMARY
      if (allFilmsAtCinema.hasOwnProperty(title)) {
        allFilmsAtCinema[title].screenings = [
          ...allFilmsAtCinema[title].screenings,
          ...mappedScreenings
        ];
      } else {
        allFilmsAtCinema[title] = {
          description: null,
          rating,
          screenings: mappedScreenings
        };
      }
    }
  }

  return allFilmsAtCinema;
};

export const cineworldScraper = async (
  url: string,
  venue: VenueNames
): Promise<CinemaSummary> => {
  const browser = await puppeteer.launch({ headless: "new" });

  //GO TO WEBPAGE
  const webPage = await browser.newPage();
  await webPage.goto(`${url}${buildYYYYMMDDFromCurrentDate()}`);
  //REJECT COOKIES
  const rejectCookiesButton = await webPage.waitForSelector(
    "button#onetrust-reject-all-handler"
  );
  await rejectCookiesButton.click();
  await webPage.waitForTimeout(1000);

  const datesWhenFilmsAreShown = await getDatesWhenFilmsAreShown(webPage);

  let allFilmsAtCinema: CinemaSummary = {};

  for (const day of datesWhenFilmsAreShown) {
    const cineworldUrl = `${url}${buildYYYYMMDDFromCineworldDay(day)}`;
    const updatedallFilmsAtCinema = await scrapeIndividualCineworldPage(
      allFilmsAtCinema,
      webPage,
      venue,
      cineworldUrl,
      day
    );
    allFilmsAtCinema = updatedallFilmsAtCinema;
  }

  await browser.close();

  fs.writeFileSync("./cineExample.json", JSON.stringify(allFilmsAtCinema));
  return allFilmsAtCinema;
};
