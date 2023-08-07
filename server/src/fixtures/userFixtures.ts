import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

interface UserInputData {
  name?: string;
  email?: string;
}

const createUser = async (
  data: UserInputData = { name: "Sample Name", email: "sample@example.com" }
): Promise<User> => {
  const manager = AppDataSource.createEntityManager();

  const user = manager.create(User, data);
  await manager.save(user);

  return await manager.findOne(User, { where: { email: user.email } });
};

export { createUser };
