import { Comment } from "../../entity/Comment";
import { Post } from "../../entity/Post";
import { User } from "../../entity/User";
import { setupServer } from "../../index";
import { createUser } from "../../fixtures/userFixtures";
import supertest from "supertest";
import { createPost } from "../../fixtures/postFixtures";

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
  await connection.close();
  await httpServer.close();
});

describe("Post Resolvers - Functional Tests", () => {
  it("should create a post successfully", async () => {
    const testUser = await createUser({
      name: "Test User",
      email: "test.user@random.com",
    });

    const mutation = `
      mutation {
        createPost(title: "Test Post", content: "This is a test post.", authorId: ${testUser.id}) {
          id
          title
          content
        }
      }
    `;

    const response = await request.post("/graphql").send({ query: mutation });

    expect(response.body.data.createPost.title).toBe("Test Post");
    expect(response.body.data.createPost.content).toBe("This is a test post.");
  });

  it("should fetch the post from db", async () => {
    const testUser = await createUser({
      name: "Test User",
      email: "test.user@random.com",
    });
    await createPost({
      authorId: testUser.id,
      title: "Sample",
      content: "Sample",
    });

    const query = `
      query {
        getAllPosts(offset: 0, limit: 10) {
          items {
            id
            title
            content
          }
          totalCount
        }
      }
    `;

    const response = await request.post("/graphql").send({ query });

    expect(response.body.data.getAllPosts.totalCount).toBeGreaterThanOrEqual(1);
  });

  it("should update a post successfully", async () => {
    const testUser = await createUser({
      name: "Test User",
      email: "test.user@random.com",
    });
    const testPost = await createPost({
      authorId: testUser.id,
      title: "Sample",
      content: "Sample",
    });

    const updatedTitle = "Updated Test Post";
    const updatedContent = "This is an updated test post.";

    const mutation = `
      mutation {
        updatePost(id: ${testPost.id}, title: "${updatedTitle}", content: "${updatedContent}") {
          id
          title
          content
        }
      }
    `;

    const response = await request.post("/graphql").send({ query: mutation });

    expect(response.body.data.updatePost.id).toBe(String(testPost.id));
    expect(response.body.data.updatePost.title).toBe(updatedTitle);
    expect(response.body.data.updatePost.content).toBe(updatedContent);
  });

  it("should delete a post successfully", async () => {
    const testUser = await createUser({
      name: "Test User",
      email: "test.user@random.com",
    });
    const testPost = await createPost({
      authorId: testUser.id,
      title: "Sample",
      content: "Sample",
    });
    const mutation = `
      mutation {
        deletePost(id: ${testPost.id})
      }
    `;

    const response = await request.post("/graphql").send({ query: mutation });

    expect(response.body.data.deletePost).toBe(true);
  });
});
