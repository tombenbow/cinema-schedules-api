import {
  buildDateObjectFromVueElements,
  getRatingFromVueLink
} from "./vueHelpers";

describe("getRatingFromVueLink", () => {
  it("returns corresponding rating when given valid link", () => {
    const linkToPG =
      "https://www.myvue.com/-/media/vuecinemas/certificates/uk/pg.png?rev=f0e6fa9f2e234b94b30a50ccbd747bba&sc_lang=en";
    const linkTo15 =
      "https://www.myvue.com/-/media/vuecinemas/certificates/uk/15.png?rev=598f12f81bdb4555be5c6f79c43b1ac0";
    expect(getRatingFromVueLink(linkToPG)).toEqual("PG");
    expect(getRatingFromVueLink(linkTo15)).toEqual("15");
  });
  it("returns TBC when passed link for which we have no corresponding rating", () => {
    const linkToNothing = "";
    expect(getRatingFromVueLink(linkToNothing)).toEqual("TBC");
  });
});

describe("buildDateObjectFromVueElements", () => {
  it("returns date from input params", () => {
    const day = "sessions-group-2024-02-14T00:00:00";
    const timeOfDay = "1:45 PM";

    expect(buildDateObjectFromVueElements(day, timeOfDay)).toEqual(
      new Date("2024-02-14T13:45:00.000Z")
    );
  });
});
