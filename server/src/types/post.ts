export const PostType = `
type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]!
  }

type Query {
    getAllPosts: [Post!]!
    getPostById(postId: ID!): Post
}`;
