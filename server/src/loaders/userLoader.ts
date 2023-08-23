import DataLoader from "dataloader";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { In } from "typeorm";

const userBatch = async (userIds: number[]): Promise<User[]> => {
  const manager = AppDataSource.createEntityManager();

  const users = await manager.find(User, {
    where: { id: In(userIds) },
  });

  const userMap: { [key: number]: User } = {};
  users.forEach((user) => {
    userMap[user.id] = user;
  });

  return userIds.map((userId) => userMap[userId]);
};

export const userLoader = new DataLoader<number, User>(userBatch);
