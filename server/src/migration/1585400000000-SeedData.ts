import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { User } from "../entity/User";
import { Post } from "../entity/Post";
import { Comment } from "../entity/Comment";
import { faker } from "@faker-js/faker";
import { AppDataSource } from "../data-source";

export class SeedData1585400000000 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    // Seed Users
    for (let i = 0; i < 10; i++) {
      const user = new User();
      user.name = faker.person.firstName();
      user.email = faker.internet.email();

      const savedUser = await AppDataSource.manager.save(User, user);

      // Seed Posts for the user
      for (let j = 0; j < 3; j++) {
        const post = new Post();
        post.title = faker.lorem.sentence();
        post.content = faker.lorem.paragraph();
        post.author = savedUser;

        const savedPost = await AppDataSource.manager.save(Post, post);

        // Seed Comments for the post
        for (let k = 0; k < 5; k++) {
          const comment = new Comment();
          comment.content = faker.lorem.sentence();
          comment.post = savedPost;
          comment.author = savedUser;

          await AppDataSource.manager.save(Comment, comment);
        }
      }
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    await AppDataSource.manager.clear(Comment);
    await AppDataSource.manager.clear(Post);
    await AppDataSource.manager.clear(User);
  }
}
