import {
  buildCineworldUrlFromDate,
  buildDateObjectFromCineworldElements,
  buildYYYYMMDDFromCineworldDay,
  checkIfCineworldScreeningIsInHourFormat,
  formatCineworldTitle
} from "./cineworldHelpers";

describe("checkIfCineworldScreeningIsInHourFormat", () => {
  it("checks times appropriately", () => {
    expect(checkIfCineworldScreeningIsInHourFormat("WedJan 17")).toBeFalsy();
    expect(checkIfCineworldScreeningIsInHourFormat("25:00")).toBeFalsy();
    expect(checkIfCineworldScreeningIsInHourFormat("23:60")).toBeFalsy();

    expect(checkIfCineworldScreeningIsInHourFormat("20:15")).toBeTruthy();
    expect(checkIfCineworldScreeningIsInHourFormat("20:50")).toBeTruthy();
    expect(checkIfCineworldScreeningIsInHourFormat("19:40")).toBeTruthy();
    expect(checkIfCineworldScreeningIsInHourFormat("13:20")).toBeTruthy();
    expect(checkIfCineworldScreeningIsInHourFormat("09:17")).toBeTruthy();
  });
});

describe("buildDateObjectFromCineworldElements", () => {
  it("builds time correctly", () => {
    const day = "27 January 2024";
    const time = "19:20";
    expect(buildDateObjectFromCineworldElements(day, time)).toEqual(
      new Date("2024-01-27T19:20:00.000Z")
    );
  });
  it("builds time correctly again", () => {
    const day = "9 November 2027";
    const time = "07:15";
    expect(buildDateObjectFromCineworldElements(day, time)).toEqual(
      new Date("2027-11-09T07:15:00.000Z")
    );
  });
});

describe("buildYYYYMMDDFromCineworldDay", () => {
  it("builds date correctly", () => {
    expect(buildYYYYMMDDFromCineworldDay("23 February 2024")).toEqual(
      "2024-02-23"
    );
    expect(buildYYYYMMDDFromCineworldDay("30 May 2024")).toEqual("2024-05-30");
    expect(buildYYYYMMDDFromCineworldDay("4 March 2284")).toEqual("2284-03-04");
  });
});

describe("buildCineworldUrlFromDate", () => {
  it("build url correctly", () => {
    const url =
      "https://www.cineworld.co.uk/cinemas/newcastle-upon-tyne/105#/buy-tickets-by-cinema?in-cinema=105&at=2024-01-23&view-mode=list";
    const dateString = "1 May 2024";
    expect(buildCineworldUrlFromDate(url, dateString)).toEqual(
      "https://www.cineworld.co.uk/cinemas/newcastle-upon-tyne/105#/buy-tickets-by-cinema?in-cinema=105&at=2024-05-01&view-mode=list"
    );
  });
});

describe("formatCineworldTitle", () => {
  it("it removes unwanted text", () => {
    expect(
      formatCineworldTitle("Sci-Fi Season: Blade Runner : The Final Cut")
    ).toEqual("Blade Runner : The Final Cut");
    expect(formatCineworldTitle("Sci-Fi Season: Blade Runner 2049")).toEqual(
      "Blade Runner 2049"
    );
    expect(
      formatCineworldTitle("Wicked Little Letters Unlimited Screening")
    ).toEqual("Wicked Little Letters");
    expect(
      formatCineworldTitle("Demon Slayer: To The Hashira Training (subbed)")
    ).toEqual("Demon Slayer: To The Hashira Training (subbed)");
    expect(
      formatCineworldTitle("Action Season : Commando (1985)")
    ).toEqual("Commando (1985)")
  });
});
