import { AppDataSource } from "../../data-source";
import { CommentResolvers } from "../CommentResolvers";

describe("Comment Resolvers - Unit Tests", () => {
  let mockManager;

  beforeEach(() => {
    mockManager = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    AppDataSource.createEntityManager = jest.fn().mockReturnValue(mockManager);
  });

  it("should throw an error when the post is not found", async () => {
    mockManager.findOne.mockResolvedValue(null);

    await expect(
      CommentResolvers.Mutation.addComment(null, {
        postId: 1,
        content: "Test Comment",
        authorId: 2,
      })
    ).rejects.toThrow("Post not found");
  });

  it("should add a comment successfully", async () => {
    const mockCommentData = {
      content: "Test Comment",
      post: { id: 1 },
      author: { id: 2 },
    };

    mockManager.findOne
      .mockResolvedValueOnce({ id: 1, title: "Post Title" }) // finding post
      .mockResolvedValueOnce({ ...mockCommentData, id: 100 }); // returning saved comment

    mockManager.create.mockReturnValue(mockCommentData);
    mockManager.save.mockResolvedValue({ ...mockCommentData, id: 100 });

    const result = await CommentResolvers.Mutation.addComment(null, {
      postId: 1,
      content: "Test Comment",
      authorId: 2,
    });

    expect(result).toEqual({
      ...mockCommentData,
      id: 100,
    });
  });
});
