import { Comment } from "../../entity/Comment";
import { Post } from "../../entity/Post";
import { User } from "../../entity/User";
import { setupServer } from "../../index";
import { createUser } from "../../fixtures/userFixtures";
import supertest from "supertest";

let request;
let httpServer;
let connection;

beforeAll(async () => {
  const result = await setupServer();

  httpServer = result.httpServer;
  connection = result.connection;

  request = supertest(httpServer);
});

afterEach(async () => {
  await connection.createQueryBuilder().delete().from(Comment).execute();
  await connection.createQueryBuilder().delete().from(Post).execute();
  await connection.createQueryBuilder().delete().from(User).execute();
});

afterAll(async () => {
  connection.close();
  httpServer.close();
});

describe("User Resolvers - Functional Tests", () => {
  it("should fetch all users from the database", async () => {
    const query = `
      query {
        getAllUsers {
          id
          name
          email
        }
      }
    `;

    await createUser({ name: "John", email: "john@random.com" });
    await createUser({ name: "Jane", email: "jane@random.com" });

    const response = await request.post("/graphql").send({ query });

    const users = response.body.data.getAllUsers;
    const johnUser = users.find((user) => user.email === "john@random.com");
    const janeUser = users.find((user) => user.email === "jane@random.com");

    expect(johnUser).toBeDefined();
    expect(johnUser.name).toBe("John");

    expect(janeUser).toBeDefined();
    expect(janeUser.name).toBe("Jane");
  });

  it("should create a new user successfully", async () => {
    const mutation = `
      mutation {
        createUser(name: "John", email: "john@random.com") {
          id
          name
          email
        }
      }
    `;

    const response = await request.post("/graphql").send({ query: mutation });
    expect(response.status).toBe(200);
    expect(response.body.data.createUser.name).toBe("John");
    expect(response.body.data.createUser.email).toBe("john@random.com");
  });

  it("should update a user successfully", async () => {
    const user = await createUser({ name: "John", email: "john@random.com" });
    const mutation = `
      mutation {
        updateUser(id: "${user.id}", name: "Jane", email: "jane@random.com") {
          id
          name
          email
        }
      }
    `;

    const response = await request.post("/graphql").send({ query: mutation });
    expect(response.status).toBe(200);
    expect(response.body.data.updateUser.name).toBe("Jane");
    expect(response.body.data.updateUser.email).toBe("jane@random.com");
  });

  it("should delete a user successfully", async () => {
    const user = await createUser();
    const mutation = `
      mutation {
        deleteUser(id: "${user.id}")
      }
    `;

    const response = await request.post("/graphql").send({ query: mutation });
    expect(response.status).toBe(200);
    expect(response.body.data.deleteUser).toBe(true);
  });

  it("should not create a user with an existing email", async () => {
    await createUser({ name: "John", email: "john@random.com" });
    const mutation = `
      mutation {
        createUser(name: "John", email: "john@random.com") {
          id
          name
          email
        }
      }
    `;

    const response = await request.post("/graphql").send({ query: mutation });
    expect(response.body.errors[0].message).toBe(
      "A user with this email already exists"
    );
  });

  it("should not update a user to an existing email", async () => {
    const user1 = await createUser({ name: "John", email: "john@random.com" });
    const user2 = await createUser({ name: "Doe", email: "doe@random.com" });

    const mutation = `
      mutation {
        updateUser(id: "${user2.id}", name: "Jane", email: "${user1.email}") {
          id
          name
          email
        }
      }
    `;

    const response = await request.post("/graphql").send({ query: mutation });
    expect(response.body.errors[0].message).toBe(
      "A user with this email already exists"
    );
  });
});
