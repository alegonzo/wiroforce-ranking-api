import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Leaderboard, Rank } from 'redis-rank';
import { Repository } from 'typeorm';
import { CreateRankingDto } from '../dto/create-ranking.dto';
import { RankingPaginationDto } from '../dto/ranking-pagination.dto';
import { RankingResponseDto } from '../dto/ranking-response.dto';
import { UpdateRankingDto } from '../dto/update-ranking.dto';
import { UploadScoreDto } from '../dto/upload-score.dto';
import { Player } from '../entities/player.entity';
import { Ranking } from '../entities/ranking.entity';
import { PlayerService } from './player.service';
import groupBy = require('lodash.groupby');

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Ranking)
    private rankingRepository: Repository<Ranking>,
    private playerService: PlayerService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  findAllByAppId(applicationId: string): Promise<Ranking[]> {
    return this.rankingRepository.find({
      where: { applicationId },
    });
  }

  async findAllByUser(req): Promise<any> {
    const player: Player = req.user;
    const rankings = await this.rankingRepository.find({
      where: { applicationId: player.applicationId },
    });
    return {
      results: rankings,
    };
  }

  async findPlayers(id: string) {
    const lb = new Leaderboard(this.redis, `ranking:${id}`, {
      sortPolicy: 'high-to-low',
      updatePolicy: 'replace',
    });
    const rankingPlayers = await lb.top(20);
    const players = await this.playerService.findPlayersByIds(
      rankingPlayers.filter((item) => item.id !== '-').map((item) => item.id),
    );
    const groupedPlayers = groupBy(players, 'id');

    return {
      results: rankingPlayers
        .filter((item) => item.id !== '-')
        .map(
          (item) =>
            new RankingResponseDto({
              id: item.id,
              rank: item.rank,
              score: item.score,
              username: groupedPlayers[item.id][0]?.username,
            }),
        ),
    };
  }

  async findPlayersPaginated(data: RankingPaginationDto) {
    const lb = new Leaderboard(this.redis, `ranking:${data.rankingId}`, {
      sortPolicy: 'high-to-low',
      updatePolicy: 'replace',
    });
    const rankingPlayers = await lb.list(data.start, data.end);
    const players = await this.playerService.findPlayersByIds(
      rankingPlayers.filter((item) => item.id !== '-').map((item) => item.id),
    );
    const groupedPlayers = groupBy(players, 'id');

    return rankingPlayers
      .filter((item) => item.id !== '-')
      .map(
        (item) =>
          new RankingResponseDto({
            id: item.id,
            rank: item.rank,
            score: item.score,
            username: groupedPlayers[item.id][0]?.username,
          }),
      );
  }

  async countUsersInRanking(id: string): Promise<number> {
    const lb = new Leaderboard(this.redis, `ranking:${id}`, {
      sortPolicy: 'high-to-low',
      updatePolicy: 'replace',
    });
    const count = await lb.count();
    return count;
  }

  async create(body: CreateRankingDto) {
    const exists = await this.rankingRepository.findOne({
      where: {
        name: body.name,
      },
    });
    if (exists)
      throw new BadRequestException('Ya existe un ranking con ese nombre');
    const ranking = await this.rankingRepository.save({
      ...body,
    });
    const lb = new Leaderboard(this.redis, `ranking:${ranking.id}`, {
      sortPolicy: 'high-to-low',
      updatePolicy: 'replace',
    });
    await lb.update([{ id: '-', value: 0 }]);
    return ranking;
  }

  async uploadScore(body: UploadScoreDto, req) {
    const player: Player = req.user;
    const ranking = await this.rankingRepository.findOne(body.rankingId);
    if (player.applicationId !== ranking.applicationId)
      throw new BadRequestException('El usuario no puede realizar la accion');

    const lb = new Leaderboard(this.redis, `ranking:${ranking.id}`, {
      sortPolicy: 'high-to-low',
      updatePolicy: 'replace',
    });
    return lb.update([{ id: player.id, value: body.score }]);
  }

  async update(body: UpdateRankingDto) {
    const ranking = await this.rankingRepository.findOne(body.id);
    ranking.description = body.description;
    ranking.price = body.price;
    return this.rankingRepository.save(ranking);
  }

  async delete(id: string) {
    const lb = new Leaderboard(this.redis, `ranking:${id}`, {
      sortPolicy: 'high-to-low',
      updatePolicy: 'replace',
    });
    await lb.clear();
    return lb.update([{ id: '-', value: 0 }]);
    //return this.rankingRepository.delete(id);
  }
}
