// loaders/commentLoader.ts
import DataLoader from "dataloader";
import { Comment } from "../entity/Comment";
import { AppDataSource } from "../data-source";
import { In } from "typeorm";

const commentBatch = async (commentIds: number[]): Promise<Comment[]> => {
  const manager = AppDataSource.createEntityManager();

  // Fetching comments based on comment IDs
  const comments = await manager.find(Comment, {
    where: { id: In(commentIds) },
  });

  const commentMap: { [key: number]: Comment } = {};

  // Mapping comments to their IDs
  comments.forEach((comment) => {
    commentMap[comment.id] = comment;
  });

  return commentIds.map((commentId) => commentMap[commentId] ?? null);
};

export const commentLoader = new DataLoader<number, Comment | null>(commentBatch);
