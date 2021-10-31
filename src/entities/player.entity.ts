import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  username?: string;

  @Column()
  applicationId?: string;

  @Column()
  token?: string;

  @CreateDateColumn()
  createdAt?: Date;
}
