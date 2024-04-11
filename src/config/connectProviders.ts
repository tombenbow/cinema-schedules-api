import FBprovider from "./firebaseProvider";

export const connectProviders = async () => {
  await FBprovider.initialise();
};
