import { CinemaSummary } from "types";
import firebaseProvider from "../../config/firebaseProvider";
import { Collections } from "../../enums/collections";
import { FieldPath } from "firebase-admin/firestore";

export const getCinemaSummariesFromFirestore = async (
  venues: string[]
): Promise<CinemaSummary[]> => {
  const cinemaSummaries: CinemaSummary[] = [];

  await firebaseProvider.db
    .collection(Collections.SUMMARIES)
    .where(FieldPath.documentId(), "in", venues)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        cinemaSummaries.push(data.screenings);
      });
    })
    .catch((err) => {
      throw new Error(`Error getting documents: ${err}`);
    });

  return cinemaSummaries;
};
