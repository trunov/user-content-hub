import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Post } from "./entity/Post";
import { Comment } from "./entity/Comment";
import "dotenv/config";
import { SeedData1585400000000 } from "./migration/1585400000000-SeedData";

const isTestEnv = process.env.NODE_ENV === "test";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: isTestEnv ? process.env.TEST_DB_DATABASE : process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE === "true",
  logging: process.env.DB_LOGGING === "true",
  entities: [User, Post, Comment],
  subscribers: [],
  migrations: [SeedData1585400000000],
});
