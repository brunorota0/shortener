import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Url extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  longUrl: string

  @Column()
  shortUrl: string

  @Column()
  code: string

  @Column()
  @Exclude()
  token: string

  @Exclude()
  @CreateDateColumn()
  createdAt: Date
}