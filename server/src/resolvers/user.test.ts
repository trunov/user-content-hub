import { setupServer } from "../index";
import supertest from "supertest";

let request;
let httpServer;

beforeAll(async () => {
  httpServer = await setupServer();
  request = supertest(httpServer);
});

afterAll(async () => {
  httpServer.close();
});

describe("User Query", () => {
  it("should get user by id", async () => {
    const userId = "1"; // Sample user ID
    const query = `
      query {
        user(id: "${userId}") {
          id
          name
        }
      }
    `;

    const response = await request.post("/graphql").send({ query });
    expect(response.status).toBe(200);
    expect(response.body.data.user.id).toBe(userId);
  });
});
