import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ranking } from './ranking.entity';

@Entity()
export class Winner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    array: true,
    default: [],
  })
  winners: string[];

  @Column({ type: 'text' })
  price: string;

  @ManyToOne(() => Ranking, (ranking) => ranking.winners, {
    cascade: true,
  })
  ranking: Ranking;

  @CreateDateColumn()
  createdAt: Date;
}
