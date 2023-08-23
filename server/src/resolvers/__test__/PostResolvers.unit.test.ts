import { AppDataSource } from "../../data-source";
import { PostResolvers } from "../PostResolvers";

describe("Post Resolvers - Unit Tests", () => {
  let mockManager;

  beforeEach(() => {
    mockManager = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findAndCount: jest.fn(),
      remove: jest.fn(),
      delete: jest.fn(),
    };

    AppDataSource.createEntityManager = jest.fn().mockReturnValue(mockManager);
  });

  it("should create a post successfully", async () => {
    const mockPostData = {
      title: "Post 1",
      content: "Content 1",
      authorId: 1,
    };
    mockManager.create.mockReturnValue(mockPostData);
    mockManager.save.mockResolvedValue(mockPostData);

    const result = await PostResolvers.Mutation.createPost(null, mockPostData, {
      manager: mockManager,
    });

    expect(mockManager.create).toHaveBeenCalledWith(
      expect.anything(),
      mockPostData
    );
    expect(mockManager.save).toHaveBeenCalledWith(mockPostData);
    expect(result).toEqual(mockPostData);
  });

  it("should fetch all posts with pagination", async () => {
    const mockPosts = [
      { id: 1, title: "Post 1", content: "Content 1", authorId: 1 },
      { id: 2, title: "Post 2", content: "Content 2", authorId: 2 },
      { id: 3, title: "Post 3", content: "Content 3", authorId: 3 },
    ];
    mockManager.findAndCount.mockResolvedValue([mockPosts, mockPosts.length]);

    const { items, totalCount } = await PostResolvers.Query.getAllPosts(
      null,
      {
        offset: 0,
        limit: 10,
      },
      { manager: mockManager }
    );

    expect(mockManager.findAndCount).toHaveBeenCalledWith(expect.anything(), {
      skip: 0,
      take: 10,
    });
    expect(items).toEqual(mockPosts);
    expect(totalCount).toBe(mockPosts.length);
  });

  it("should fetch a post by its ID", async () => {
    const mockPost = {
      id: 1,
      title: "Post 1",
      content: "Content 1",
      authorId: 1,
    };
    mockManager.findOne.mockResolvedValue(mockPost);

    const result = await PostResolvers.Query.getPostById(
      null,
      { postId: 1 },
      { manager: mockManager }
    );

    expect(mockManager.findOne).toHaveBeenCalledWith(expect.anything(), {
      where: { id: 1 },
    });
    expect(result).toEqual(mockPost);
  });

  it("should update a post successfully", async () => {
    const mockPost = {
      id: 1,
      title: "Post 1",
      content: "Content 1",
    };
    mockManager.update.mockResolvedValue({});
    mockManager.findOne.mockResolvedValue(mockPost);

    const result = await PostResolvers.Mutation.updatePost(null, mockPost, {
      manager: mockManager,
    });

    expect(mockManager.update).toHaveBeenCalledWith(expect.anything(), 1, {
      title: "Post 1",
      content: "Content 1",
    });
    expect(mockManager.findOne).toHaveBeenCalledWith(expect.anything(), {
      where: { id: 1 },
    });
    expect(result).toEqual(mockPost);
  });

  it("should delete a post successfully", async () => {
    const mockPost = {
      id: 1,
      title: "Post 1",
      content: "Content 1",
      comments: [],
    };
    mockManager.findOne.mockResolvedValue(mockPost);
    mockManager.remove.mockResolvedValue(true);

    const result = await PostResolvers.Mutation.deletePost(
      null,
      { id: 1 },
      { manager: mockManager }
    );

    expect(mockManager.findOne).toHaveBeenCalledWith(expect.anything(), {
      where: { id: 1 },
      relations: ["comments"],
    });
    expect(result).toBe(true);
  });
});
