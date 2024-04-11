import { isScreeningATheatreProduction } from "./genericHelpers";

describe('isScreeningATheatreProduction', () => {
    it('returns true if screening is a theatre production', () => {
      expect(isScreeningATheatreProduction("ROH Live: Manon (2023/2024 Ballet)")).toBeTruthy()
      expect(isScreeningATheatreProduction("National Theatre Live: Dear England")).toBeTruthy()
    });
    it('returns false if screening is not a theatre production', () => {
      expect(isScreeningATheatreProduction("Goodfellas")).toBeFalsy()
    });
  });