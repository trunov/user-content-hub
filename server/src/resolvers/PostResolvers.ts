import { Comment } from "../entity/Comment";
import { Post } from "../entity/Post";
import { userLoader } from "../loaders/userLoader";

export const PostResolvers = {
  Post: {
    author: (post) => {
      return userLoader.load(post.authorId);
    },
    comments: async (parent, _args, { manager }) => {
      return await manager.find(Comment, {
        where: { postId: parent.id },
      });
    },
  },
  Comment: {
    author: async (comment) => {
      return userLoader.load(comment.authorId);
    },
  },
  Query: {
    getAllPosts: async (_, { offset = 0, limit = 10 }, { manager }) => {
      const [items, totalCount] = await manager.findAndCount(Post, {
        skip: offset,
        take: limit,
      });

      return {
        items,
        totalCount,
      };
    },
    getPostById: async (_, { postId }, { manager }) => {
      return await manager.findOne(Post, {
        where: { id: postId },
      });
    },
  },
  Mutation: {
    createPost: async (_, { title, content, authorId }, { manager }) => {
      const post = manager.create(Post, { title, content, authorId });
      return await manager.save(post);
    },
    updatePost: async (_, { id, title, content }, { manager }) => {
      await manager.update(Post, id, { title, content });
      return await manager.findOne(Post, {
        where: { id: id },
      });
    },
    deletePost: async (_, { id }, { manager }) => {
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
