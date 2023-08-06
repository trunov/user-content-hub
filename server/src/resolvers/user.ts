import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const UserResolvers = {
  Query: {
    getAllUsers: async () => {
      const manager = AppDataSource.createEntityManager();
      return await manager.find(User);
    },
  },
};
