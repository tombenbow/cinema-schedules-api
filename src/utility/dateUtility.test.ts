import { beginningOfDay } from "./dateUtility";

describe("beginningOfDay", () => {
  it("works", () => {
    // expect(beginningOfDay(new Date("2024-04-08T18:45:00.000Z"))).toEqual(
    //   new Date("2024-04-08T00:00:00.001Z")
    // );
    console.log(beginningOfDay(new Date("2024-04-08T18:45:00.000Z")));
    console.log(
      beginningOfDay(new Date("2024-04-08T18:45:00.000Z")).toISOString()
    );
    console.log(
      beginningOfDay(new Date("2024-04-08T18:45:00.000Z")).toDateString()
    );
  });
});
