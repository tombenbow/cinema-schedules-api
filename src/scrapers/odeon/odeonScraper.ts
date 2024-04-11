import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { FilmScreening, CinemaSummary } from "types";
import { isScreeningATheatreProduction } from "../genericHelpers/genericHelpers";
import { VenueNames } from "../../enums/venueNames";

puppeteer.use(stealthPlugin());

export const odeonScraper = async (
  url: string,
  venue: VenueNames
): Promise<CinemaSummary> => {
  const browser = await puppeteer.launch({
    headless: "new"
  });

  //GO TO WEBPAGE
  const webPage = await browser.newPage();
  await webPage.goto(url);
  await webPage.waitForTimeout(1000);

  //REJECT COOKIES
  const rejectCookiesButton = await webPage.waitForSelector(
    "button#onetrust-reject-all-handler"
  );
  await rejectCookiesButton.click();
  await webPage.waitForTimeout(1000);

  //CLOSE ONSITE POPUP
  const closeBookOnlineBannerButton = await webPage.waitForSelector(
    "button.popup-modal-close"
  );
  await closeBookOnlineBannerButton.click();
  await webPage.waitForTimeout(1000);

  let allFilmsAtCinema: CinemaSummary = {};

  //ITERATE OVER THE DAYS OF THE WEEK ON WHICH FILMS ARE SHOWN
  await webPage.waitForSelector(".v-carousel__track");
  const dateButtons = await webPage.$$(".v-carousel__track li");
  for (const dateButton of dateButtons) {
    const button = await dateButton.$(".v-date-picker-date__button");

    await button.click();
    await webPage.waitForTimeout(1000);

    //ITERATE OVER THE FILMS THAT WILL BE SHOWN ON THAT DAY
    const filmsOnPage = await webPage.$$(".v-showtime-picker-film-list__item");
    for (const film of filmsOnPage) {
      const title = await film.$eval(
        ".v-film-title__text",
        (titleElement: any) => titleElement.textContent
      );
      if (!isScreeningATheatreProduction(title)) {
        const description = await film.$eval(
          ".v-detail__content",
          (descriptionElement: any) => descriptionElement.textContent
        );
        const rating = await film.$eval(
          ".v-film-title__censor-rating img",
          (imgElement: any) => imgElement.getAttribute("alt")
        );

        const screenings: FilmScreening[] = [];

        //ITERATE OVER THE SCREENINGS FOR THAT FILM ON THAT DAY
        const showtimeButtons = await film.$$(".v-showtime-list__item");
        for (const showtimeButton of showtimeButtons) {
          const time = await showtimeButton.$$eval(
            ".v-showtime-button__detail-start-time",
            (timeElements: any) => {
              return timeElements[0].getAttribute("datetime");
            }
          );

          const link = await showtimeButton.$$eval(
            ".v-link",
            (linkElements: any) => {
              return linkElements[0].getAttribute("href");
            }
          );

          screenings.push({ time: new Date(time), link, venue_name: venue });
        }

        if (allFilmsAtCinema.hasOwnProperty(title)) {
          allFilmsAtCinema[title].screenings = [
            ...allFilmsAtCinema[title].screenings,
            ...screenings
          ];
        } else {
          allFilmsAtCinema[title] = {
            description,
            rating,
            screenings
          };
        }
      }
    }
  }

  await browser.close();

  return allFilmsAtCinema;
};
