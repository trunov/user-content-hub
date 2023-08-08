# GraphQL Server and Client Setup & Usage Instructions

## Server Setup

### 1. **Environment Setup**

Rename `.env.copy` to `.env`. This file contains all the necessary environment variables for your server to function.

### 2. **Database Configuration**

Make sure you have a PostgreSQL instance running on your machine or a remote server. Set the database details accordingly in the `.env` file.

### 3. **Installation and Start**

```bash
cd server
npm install
npm start
```

Your server should be running at `http://localhost:4000/graphql`

### 4. **Testing**

The GraphQL resolvers are well-tested with both unit and functional tests. These tests ensure that the core functionalities of the application remain intact as changes are made.

### Running Tests

To run the tests:

1. Navigate to the server directory:

```bash
cd server
```

2. Run the tests using the following command:

```bash
npm test
```

This command will execute both unit and functional tests, providing detailed feedback on any failures or errors.

### 5. **Data Seeding**

Upon starting the server, mock data is automatically seeded into the database to facilitate development.

The seeded data includes:

- **10 Users**: Simulated users to represent the application's userbase.
- **3 Posts per User**: Each of the 10 users has 3 posts.
- **5 Comments per Post**: Every post is populated with comments.

## Client Setup

### 1. **Environment Setup**

Rename `.env.copy` to `.env`. This file contains the GraphQL endpoint for the client.

### 2. **Installation and Start**

```bash
cd client
npm install
npm start
```

Your client should be running and connecting to the GraphQL server.

## Usage

1. **Posts**: You can create, read, update, and delete posts. Each post has an associated author and comments.
2. **Comments**: Comments can be added to a specific post. Each comment must have an associated post and author.
3. **Users**: Create, read, update, and delete users.

For queries and mutations, navigate to http://localhost:4000/graphql and utilize the in-built playground/documentation to explore available operations.

## Areas of Improvement

1. **Comments**:

   - Implement pagination for scalability. Currently, if a post has hundreds or thousands of comments, they will be loaded all at once which may not be performant.
   - Add timestamps to understand when each comment was made.

2. **Authentication & Authorization**:

   - Implement user authentication to restrict and personalize actions.
   - Introduce roles, especially an admin role. Admins should have more privileges, e.g., moderation rights, than regular users.
   - Only allow authors of posts and comments to edit or delete their content.

3. **Content Enhancement**:

   - Allow image attachments in posts to make them more engaging.
   - Enable audio comments to provide richer interactions.
   - Implement a system for likes and views.

4. **Moderation and Censorship**:
   - Develop a moderation system for comments.
   - Introduce algorithms to automatically detect and censor inappropriate content.

Following these instructions and considerations, you should have a basic functioning GraphQL server and client, with clear paths for potential enhancements in the future.
