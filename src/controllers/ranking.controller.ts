import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateRankingDto } from '../dto/create-ranking.dto';
import { RankingPaginationDto } from '../dto/ranking-pagination.dto';
import { UpdateRankingDto } from '../dto/update-ranking.dto';
import { UploadScoreDto } from '../dto/upload-score.dto';
import { Ranking } from '../entities/ranking.entity';
import { RankingService } from '../services/ranking.service';
import {
  RANKING_COUNT,
  RANKING_CREATE,
  RANKINGS_BY_APP_ID,
  RANKING_DELETE,
  RANKING_UPDATE,
  RANKING_GET_PLAYERS,
} from '../utils/constants';

@Controller('rankings')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('/:id')
  getPlayersMobile(@Param('id') id: string) {
    return this.rankingService.findPlayers(id);
  }

  @Get()
  getRankingsMobile(@Req() req) {
    return this.rankingService.findAllByAppId(req);
  }

  @Post('/upload-score')
  uploadScore(@Body() body: UploadScoreDto, @Req() req) {
    return this.rankingService.uploadScore(body, req);
  }

  @MessagePattern({ cmd: RANKING_CREATE })
  create(data: CreateRankingDto): Promise<Ranking> {
    try {
      return this.rankingService.create(data);
    } catch (e) {
      return e;
    }
  }

  @MessagePattern({ cmd: RANKING_UPDATE })
  update(data: UpdateRankingDto) {
    return this.rankingService.update(data);
  }

  @MessagePattern({ cmd: RANKING_DELETE })
  delete(id: string) {
    return this.rankingService.delete(id);
  }

  @MessagePattern({ cmd: RANKING_COUNT })
  countPlayers(id: string): Promise<number> {
    return this.rankingService.countUsersInRanking(id);
  }

  @MessagePattern({ cmd: RANKINGS_BY_APP_ID })
  getRankingByAppIdQueue(applicationId: string): Promise<Ranking[]> {
    return this.rankingService.findAllByAppId(applicationId);
  }

  @MessagePattern({ cmd: RANKING_GET_PLAYERS })
  getPlayersInRanking(data: RankingPaginationDto): Promise<Ranking[]> {
    return this.rankingService.findPlayersPaginated(data);
  }
}
