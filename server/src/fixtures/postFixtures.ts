import { AppDataSource } from "../data-source";
import { Post } from "../entity/Post";

interface PostInputData {
  title?: string;
  content?: string;
  authorId?: number;
}

const createPost = async (
  data: PostInputData = {
    title: "Sample Title",
    content: "Sample Content",
    authorId: 1,
  }
): Promise<Post> => {
  const manager = AppDataSource.createEntityManager();

  const post = manager.create(Post, data);
  await manager.save(post);

  return await manager.findOne(Post, {
    where: { title: post.title, content: post.content },
  });
};

export { createPost };
