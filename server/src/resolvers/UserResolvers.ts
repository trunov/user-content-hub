import { Comment } from "../entity/Comment";
import { Post } from "../entity/Post";
import { User } from "../entity/User";

export const UserResolvers = {
  Query: {
    getAllUsers: async (_parent, _args: any, { manager }) => {
      return await manager.find(User);
    },
  },
  Mutation: {
    createUser: async (_, { name, email }, { manager }) => {
      const existingUser = await manager.findOne(User, {
        where: { email: email },
      });
      if (existingUser) {
        throw new Error("A user with this email already exists");
      }

      const user = manager.create(User, { name, email });
      return await manager.save(user);
    },
    updateUser: async (_, { id, name, email }, { manager }) => {
      const existingUser = await manager.findOne(User, {
        where: { email: email },
      });

      if (existingUser && existingUser.id !== Number(id)) {
        throw new Error("A user with this email already exists");
      }

      await manager.update(User, id, { name, email });

      return await manager.findOne(User, {
        where: { id: id },
      });
    },
    deleteUser: async (_, { id }, { manager }) => {
      const user = await manager.findOne(User, {
        where: { id: id },
        relations: ["comments", "posts"],
      });
      if (!user) throw new Error("User not found");

      if (user.comments && user.comments.length > 0) {
        await manager.delete(Comment, { author: user });
      }

      if (user.posts && user.posts.length > 0) {
        await manager.delete(Post, { author: user });
      }

      await manager.remove(user);
      return true;
    },
  },
};
