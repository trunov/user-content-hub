import { AppDataSource } from "../data-source";
import { Post } from "../entity/Post";
import { userLoader } from "../loaders/userLoader";

export const PostResolvers = {
  Post: {
    author: (post) => {
      return userLoader.load(post.authorId);
    },
  },
  Query: {
    getAllPosts: async () => {
      const manager = AppDataSource.createEntityManager();
      return await manager.find(Post);
    },
    getPostById: async (_, { postId }) => {
      const manager = AppDataSource.createEntityManager();
      return await manager.findOne(Post, {
        where: { id: postId },
        relations: ["comments", "comments.author"],
      });
    },
  },
};
