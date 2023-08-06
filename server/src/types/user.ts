export const UserType = `
type User {
    id: ID!
    name: String!
    email: String!
}

type Query {
    getAllUsers: [User!]!
}`;
