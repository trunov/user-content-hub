import { AppDataSource } from "../data-source";
import { Comment } from "../entity/Comment";
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
  Mutation: {
    createPost: async (_, { title, content, authorId }) => {
      const manager = AppDataSource.createEntityManager();
      const post = manager.create(Post, { title, content, authorId });
      return await manager.save(post);
    },
    updatePost: async (_, { id, title, content }) => {
      const manager = AppDataSource.createEntityManager();
      await manager.update(Post, id, { title, content });
      return await manager.findOne(Post, {
        where: { id: id },
        relations: ["comments", "comments.author"],
      });
    },
    deletePost: async (_, { id }) => {
      const manager = AppDataSource.createEntityManager();

      const post = await manager.findOne(Post, {
        where: { id: id },
        relations: ["comments"],
      });
      if (!post) throw new Error("Post not found");

      if (post.comments) {
        await manager.delete(Comment, { post: post });
      }

      await manager.remove(post);

      return true;
    },
  },
};
