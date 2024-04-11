import { connectProviders } from "../../config/connectProviders";
import { invokeScrapers } from "./invokeScrapers";

beforeAll(async () => {
  await connectProviders();
});

describe("invokeScrapers", () => {
  it("works", async () => {
    await invokeScrapers();
  });
});
