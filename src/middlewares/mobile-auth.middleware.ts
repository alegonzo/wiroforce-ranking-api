import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { PlayerService } from '../services/player.service';

@Injectable()
export class MobileAuthMiddleware implements NestMiddleware {
  constructor(private playerService: PlayerService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.toString();
    if (!token)
      throw new UnauthorizedException(
        'You are not authorized to perform the operation',
      );
    const player = await this.playerService.findPlayerByToken(token);
    if (!player)
      throw new UnauthorizedException(
        'You are not authorized to perform the operation',
      );
    req['user'] = player;
    next();
  }
}
