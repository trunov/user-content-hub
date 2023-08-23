import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  postId: number;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @Column()
  authorId: number;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;
}
