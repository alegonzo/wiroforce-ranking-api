import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { Player } from '../entities/player.entity';
import { PlayerService } from '../services/player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('register')
  create(@Body() body: CreatePlayerDto): Promise<Player> {
    return this.playerService.registerPlayer(body);
  }
}
