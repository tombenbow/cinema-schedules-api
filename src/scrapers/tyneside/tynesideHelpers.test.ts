// import { getNext90DaysInDDMMYYYYFormat } from "./tynesideCinemaHelpers";

import { buildDateObjectFromTynesideDateStrings } from "./tynesideHelpers";

// describe('tyneside', () => {
//     it('', () => {
//         console.log(getNext90DaysInDDMMYYYYFormat())
//     });
// });

describe("buildDateObjectFromTynesideDateStrings", () => {
  it("builds date", () => {
    expect(
      buildDateObjectFromTynesideDateStrings("31-01-2024", "17:30")
    ).toEqual(new Date("2024-01-31T17:30:00.000Z"));
    expect(
      buildDateObjectFromTynesideDateStrings("11-04-2024", "09:27")
    ).toEqual(new Date("2024-04-11T08:27:00.000Z"));
  });
});
