import { buildDateObjectFromEverymanCalendar, buildDateObjectFromEverymanScreening, formatEverymanTitle } from "./everymanHelpers";

describe("buildDateObjectFromEverymanCalendar", () => {
  it("buildDateObjectFromEverymanCalendar", () => {
    expect(buildDateObjectFromEverymanCalendar("January 2024", "31")).toEqual(
      new Date("2024-01-31T00:00:00.000Z")
    );
  });
});

describe('buildDateObjectFromEverymanScreening', () => {
  it('builds date object', () => {
    expect(buildDateObjectFromEverymanScreening("18:10", "February 2024", "4")).toEqual(new Date("2024-02-04T18:10:00.000Z"))
  });
});

describe('formatEverymanTitle', () => {
  it('formats title', () => {
    expect(formatEverymanTitle("All Of Us Strangers")).toEqual("All Of Us Strangers")
    expect(formatEverymanTitle("Throwback: Willy Wonka and the Chocolate Factory")).toEqual("Willy Wonka and the Chocolate Factory")
    expect(formatEverymanTitle("Toddler Club: Turning Red")).toEqual("Turning Red")
    expect(formatEverymanTitle("Late Nights: Magic Mike")).toEqual("Magic Mike")
  });
});
