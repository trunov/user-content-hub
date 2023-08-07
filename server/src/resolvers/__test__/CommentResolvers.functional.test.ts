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
  connection.close();
  httpServer.close();
});
describe("Comment Resolvers - Functional Tests", () => {
  it("should throw an error when trying to add a comment to a non-existent post", async () => {
    const mutation = `
      mutation {
        addComment(postId: 9999, content: "Test Comment", authorId: 1) {
          id
          content
        }
      }
    `;

    const response = await request.post("/graphql").send({ query: mutation });

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe("Post not found");
  });

  it("should add a comment to a post successfully", async () => {
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
        addComment(postId: ${testPost.id}, content: "Test Comment", authorId: ${testUser.id}) {
          id
          content
          post {
            id
          }
          author {
            id
          }
        }
      }
    `;

    const response = await request.post("/graphql").send({ query: mutation });

    expect(response.body.data.addComment.content).toBe("Test Comment");
    expect(response.body.data.addComment.post.id).toBe(String(testPost.id));
    expect(response.body.data.addComment.author.id).toBe(String(testUser.id));
  });
});
