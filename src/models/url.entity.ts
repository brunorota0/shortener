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
@Index(['domain'])
export class Url extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  longUrl: string

  @Column()
  shortUrl: string

  @Column()
  domain: string

  @Column()
  code: string

  @CreateDateColumn()
  createdAt: Date
}