import { ElementHandle, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { CinemaSummary, FilmScreening } from "types";
import {
  buildDateObjectFromEverymanCalendar,
  buildDateObjectFromEverymanScreening,
  formatEverymanTitle
} from "./everymanHelpers";
import { isScreeningATheatreProduction } from "../genericHelpers/genericHelpers";
import { VenueNames } from "../../enums/venueNames";

puppeteer.use(stealthPlugin());

const acceptCookies = async (webPage: Page) => {
  const acceptCookiesButton = await webPage.waitForSelector(
    "button#didomi-notice-agree-button"
  );
  await acceptCookiesButton.click();
  await webPage.waitForTimeout(1000);
};

const openCalendar = async (webPage: Page) => {
  const calendarButton = await webPage.waitForSelector(".css-1uk4o9q");
  await calendarButton.click();
  await webPage.waitForTimeout(2000);
};

const getValidDayButtonsFromCalendar = async (webPage: Page) => {
  const allButtonsOnCalendar = await webPage.$$(".css-da22vg, .css-12g5y8z");

  const validButtons: ElementHandle[] = [];

  await Promise.all(
    allButtonsOnCalendar.map(async (button: ElementHandle) => {
      const calendarMonth = await webPage.$eval(".css-hww6rw", (element) =>
        element.textContent.trim()
      );

      const day = await webPage.evaluate((button) => {
        const element = button.querySelector(".css-ffwiej");
        return element.innerText;
      }, button);

      const midnightToday = new Date();
      midnightToday.setHours(0, 0, 0, 0);

      if (
        day.length !== 0 &&
        buildDateObjectFromEverymanCalendar(calendarMonth, day) >= midnightToday
      ) {
        validButtons.push(button);
      }
    })
  );

  return validButtons;
};

const moveMonthForwardOnCalendar = async (
  webPage: Page,
  numberOfMonths: number
) => {
  for (let i = 0; i < numberOfMonths; i++) {
    await webPage.waitForTimeout(3000);
    await webPage.waitForSelector(".css-1i478xw");
    const changeMonthButtons = await webPage.$$(".css-1i478xw");
    await changeMonthButtons[changeMonthButtons.length - 1].click();
    await webPage.waitForSelector(".css-b8w5g3, .css-da22vg, .css-12g5y8z");
    await webPage.waitForTimeout(2000);
  }
};

const scrapeIndividualPage = async (
  webPage: Page,
  allFilmsAtCinema: CinemaSummary,
  venue: VenueNames,
  yearAndMonthString: string,
  dayString: string
) => {
  const filmsOnPage = await webPage.$$(".css-m1393o");
  for (const film of filmsOnPage) {
    const { unformattedTitle, rating } = await film.$eval(
      ".css-1k0gku1",
      (element) => {
        return {
          unformattedTitle: element.childNodes[0].textContent.trim(),
          rating: element.childNodes[1]?.textContent.trim() || "TBC"
        };
      }
    );

    if (!isScreeningATheatreProduction(unformattedTitle)) {
      const title = formatEverymanTitle(unformattedTitle);

      const description = await film.$eval(".css-efkg2u", (span) =>
        span.textContent.trim()
      );

      const rawScreenings = await film.$$eval(
        ".eventRelated, .expired, .clickable",
        (elements) => {
          return elements.map((element: any) => {
            return {
              link: element.getAttribute("href"),
              hourOfScreening: element
                .querySelector(".css-1lgx68j")
                .textContent.trim()
            };
          });
        }
      );

      const mappedScreenings: FilmScreening[] = rawScreenings.map(
        (screening) => {
          return {
            link: screening.link,
            time: buildDateObjectFromEverymanScreening(
              screening.hourOfScreening,
              yearAndMonthString,
              dayString
            ),
            venue_name: venue
          };
        }
      );

      //ADD FILM SCREENINGS TO OVERALL SUMMARY
      if (allFilmsAtCinema.hasOwnProperty(title)) {
        allFilmsAtCinema[title].screenings = [
          ...allFilmsAtCinema[title].screenings,
          ...mappedScreenings
        ];
      } else {
        allFilmsAtCinema[title] = {
          description,
          rating,
          screenings: mappedScreenings
        };
      }
    }
  }

  return allFilmsAtCinema;
};

export const everymanScraper = async (
  url: string,
  venue: VenueNames
): Promise<CinemaSummary> => {
  const browser = await puppeteer.launch({ headless: false });
  const webPage = await browser.newPage();
  await webPage.goto(url);

  //SCRAPE
  await acceptCookies(webPage);

  let allFilmsAtCinema: CinemaSummary = {};

  for (let i = 0; i < 4; i++) {
    await openCalendar(webPage);
    await moveMonthForwardOnCalendar(webPage, i);
    await webPage.waitForTimeout(1500);
    const validButtons = await getValidDayButtonsFromCalendar(webPage);
    console.log("first valid buttons: ", validButtons.length);

    for (let j = 0; j < validButtons.length; j++) {
      await webPage.goto(url);
      await webPage.waitForTimeout(2000);
      await openCalendar(webPage);
      await moveMonthForwardOnCalendar(webPage, i);
      await webPage.waitForTimeout(2000);
      const freshValidButtons = await getValidDayButtonsFromCalendar(webPage);

      await webPage.waitForSelector(".css-hww6rw");
      const yearAndMonthString = await webPage.$eval(".css-hww6rw", (element) =>
        element.textContent.trim()
      );
      console.log(yearAndMonthString);

      console.log("fresh valid length: ", freshValidButtons.length);

      await freshValidButtons[j].click();
      const dayString = await freshValidButtons[j].evaluate((button) => {
        const element = button.querySelector(".css-ffwiej");
        return element.innerText;
      });
      console.log(dayString);
      await webPage.waitForTimeout(2000);

      const updatedFilmsAtCinema = await scrapeIndividualPage(
        webPage,
        allFilmsAtCinema,
        venue,
        yearAndMonthString,
        dayString
      );
      allFilmsAtCinema = updatedFilmsAtCinema;
    }
  }

  await browser.close();

  return allFilmsAtCinema;
};
