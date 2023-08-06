export const PostType = `
type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]
}

type PostPagination {
    items: [Post!]!
    totalCount: Int!
}

type Query {
    getAllPosts(offset: Int, limit: Int): PostPagination!
    getPostById(postId: ID!): Post
}

type Mutation {
    createPost(title: String!, content: String!, authorId: ID!): Post!
    updatePost(id: ID!, title: String, content: String): Post!
    deletePost(id: ID!): Boolean
}
`;
