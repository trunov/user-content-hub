const users = [{ id: "1", name: "Kirill" }];

export const UserResolvers = {
  Query: {
    numberSix: () => 6,
    user: (parent, args) => users.find((user) => user.id === args.id),
  },
};
