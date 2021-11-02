import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { Player } from '../entities/player.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async registerPlayer(body: CreatePlayerDto): Promise<Player> {
    const { username, applicationId } = body;

    return this.playerRepository.save({
      username,
      applicationId,
      token: uuidv4(),
    });
  }

  findPlayerById(id: string): Promise<Player> {
    return this.playerRepository.findOne(id);
  }

  findPlayerByToken(token: string): Promise<Player> {
    return this.playerRepository.findOne({ where: { token } });
  }

  findPlayersByIds(ids: string[]): Promise<Player[]> {
    return this.playerRepository.findByIds(ids);
  }
}
