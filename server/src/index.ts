import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { json } from "body-parser";
import { port } from "./constants/constants";
import { UserResolvers } from "./resolvers/user";
import { UserType } from "./types/user";
import { AppDataSource } from "./data-source";

export const setupServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const connection = await AppDataSource.initialize();
  await connection.runMigrations();

  const server = new ApolloServer({
    typeDefs: [UserType],
    resolvers: [UserResolvers],
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server)
  );

  return httpServer;
};

export const startServer = async () => {
  const httpServer = await setupServer();

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: port }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
};

startServer();
