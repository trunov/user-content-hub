export const UserType = `
type User {
    id: ID!
    name: String
}

type Query {
    numberSix: Int! #Should always return 6
    user(id: ID!): User
}`;
