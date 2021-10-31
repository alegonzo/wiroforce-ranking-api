import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { Winner } from './winner.entity';

@Entity()
export class Ranking {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name?: string;

  @Column({ nullable: true, default: '' })
  description?: string;

  @Column()
  applicationId?: string;

  @Column()
  static?: boolean;

  @Column({
    type: 'text',
  })
  price?: string;

  @Column({ default: null })
  resetFrecuency?: string;

  @Column({ default: null })
  nextReset?: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @OneToMany(() => Winner, (winner) => winner.ranking)
  winners?: Winner[];
}
