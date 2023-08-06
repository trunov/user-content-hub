export const CommentType = `
type Comment {
    id: ID!
    content: String!
    post: Post!
    author: User!
}

type Mutation {
    addComment(postId: ID!, content: String!, authorId: ID!): Comment!
}
`;
