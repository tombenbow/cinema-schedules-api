import { ServiceAccount, cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import firebaseProvider from "../../config/firebaseProvider";

export const testDb = async () => {
  const x = await firebaseProvider.db.listCollections();
  console.log(x);
  return x;
};
