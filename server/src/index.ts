import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { json } from "body-parser";
import { port } from "./constants/constants";
import { UserResolvers } from "./resolvers/UserResolvers";
import { UserType } from "./types/user";
import { AppDataSource } from "./data-source";
import { PostType } from "./types/post";
import { PostResolvers } from "./resolvers/PostResolvers";
import { CommentType } from "./types/comment";
import { CommentResolvers } from "./resolvers/CommentResolvers";

export const setupServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const connection = await AppDataSource.initialize();

  const server = new ApolloServer({
    typeDefs: [UserType, PostType, CommentType],
    resolvers: [UserResolvers, PostResolvers, CommentResolvers],
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server)
  );

  return { httpServer, connection };
};

export const startServer = async () => {
  const { httpServer, connection } = await setupServer();
  await connection.runMigrations();

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: port }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
};

// this was needed due to tests, they were running startServer otherwise
if (require.main === module) {
  startServer();
}
