import { testDb } from "./firestoreConnection";
import { connectProviders } from "../../config/connectProviders";

beforeAll(async () => {
  await connectProviders();
});

describe("test", () => {
  it("works", async () => {
    await testDb();
  });
});
