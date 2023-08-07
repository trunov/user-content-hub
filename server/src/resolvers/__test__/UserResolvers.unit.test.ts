import { AppDataSource } from "../../data-source";
import { UserResolvers } from "../UserResolvers";

describe("User Resolvers - Unit Tests", () => {
  let mockManager;

  beforeEach(() => {
    mockManager = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
    };

    AppDataSource.createEntityManager = jest.fn().mockReturnValue(mockManager);
  });

  it("should fetch all users", async () => {
    const mockUsers = [
      { id: 1, name: "John", email: "john@random.com" },
      { id: 2, name: "Jane", email: "jane@random.com" },
    ];

    mockManager.find.mockResolvedValue(mockUsers);

    const result = await UserResolvers.Query.getAllUsers();

    expect(result).toEqual(mockUsers);
  });

  it("should create user successfully", async () => {
    mockManager.findOne.mockResolvedValue(undefined);
    mockManager.save.mockResolvedValue({
      name: "John",
      email: "john@random.com",
    });

    const result = await UserResolvers.Mutation.createUser(null, {
      name: "John",
      email: "john@random.com",
    });

    expect(result.name).toBe("John");
    expect(result.email).toBe("john@random.com");
  });

  it("should throw error if updating user with an email that exists and belongs to another user", async () => {
    mockManager.findOne.mockResolvedValue({
      id: 2,
      name: "Jane",
      email: "jane@random.com",
    });

    await expect(
      UserResolvers.Mutation.updateUser(null, {
        id: 1,
        name: "John",
        email: "jane@random.com",
      })
    ).rejects.toThrow("A user with this email already exists");
  });

  it("should update user successfully", async () => {
    mockManager.findOne.mockResolvedValueOnce(undefined).mockResolvedValueOnce({
      id: 1,
      name: "John Doe",
      email: "john.doe@random.com",
    });

    const result = await UserResolvers.Mutation.updateUser(null, {
      id: 1,
      name: "John Doe",
      email: "john.doe@random.com",
    });

    expect(result.name).toBe("John Doe");
    expect(result.email).toBe("john.doe@random.com");
  });

  it("should throw error if trying to delete a non-existing user", async () => {
    mockManager.findOne.mockResolvedValue(undefined);

    await expect(
      UserResolvers.Mutation.deleteUser(null, {
        id: 1,
      })
    ).rejects.toThrow("User not found");
  });

  it("should delete user without posts and comments successfully", async () => {
    mockManager.findOne.mockResolvedValue({
      id: 1,
      name: "John",
      email: "john@random.com",
    });

    const result = await UserResolvers.Mutation.deleteUser(null, {
      id: 1,
    });

    expect(result).toBe(true);
  });

  it("should delete user with posts and comments successfully", async () => {
    mockManager.findOne.mockResolvedValue({
      id: 1,
      name: "John",
      email: "john@random.com",
      comments: [{ id: 1, content: "Comment1" }],
      posts: [{ id: 1, title: "Post1" }],
    });
    mockManager.delete.mockResolvedValue(true);

    const result = await UserResolvers.Mutation.deleteUser(null, {
      id: 1,
    });

    expect(result).toBe(true);
  });

  it("should throw error if user email exists", async () => {
    mockManager.findOne.mockResolvedValue({
      name: "John",
      email: "john@random.com",
    });

    await expect(
      UserResolvers.Mutation.createUser(null, {
        name: "John",
        email: "john@random.com",
      })
    ).rejects.toThrow("A user with this email already exists");
  });
});
