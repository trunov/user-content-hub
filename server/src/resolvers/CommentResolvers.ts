import { AppDataSource } from "../data-source";
import { Comment } from "../entity/Comment";
import { Post } from "../entity/Post";

export const CommentResolvers = {
  Mutation: {
    addComment: async (_, { postId, content, authorId }) => {
      const manager = AppDataSource.createEntityManager();

      const post = await manager.findOne(Post, {
        where: { id: postId },
      });

      if (!post) throw new Error("Post not found");

      const comment = manager.create(Comment, {
        content,
        post: { id: postId },
        author: { id: authorId },
      });

      const savedComment = await manager.save(comment);

      return await manager.findOne(Comment, {
        where: { id: savedComment.id },
        relations: ["post", "author"],
      });
    },
  },
};
