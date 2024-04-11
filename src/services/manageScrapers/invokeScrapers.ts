import { CinemaSummary } from "types";
import { arrayOfScrapers } from "./arrayOfScrapers";
import firebaseProvider from "../../config/firebaseProvider";
import { Collections } from "../../enums/collections";

export const invokeScrapers = async () => {
  const promises = arrayOfScrapers.map(async ({ url, venue, scraper }) => {
    try {
      console.log(`${venue} invoked ${new Date()}`);
      const cinemaSummary: CinemaSummary = await scraper(url, venue);
      //validateSummary()
      const docRef = firebaseProvider.db
        .collection(Collections.SUMMARIES)
        .doc(venue);
      await docRef.set({ screenings: cinemaSummary, last_updated: new Date() });
      console.log(`${venue} complete: ${new Date()}`);
    } catch (error) {
      console.error(`${venue} errored: ${new Date()}. Error: ${error}`);
      throw new Error(error);
    }
  });

  await Promise.all(promises);
};
