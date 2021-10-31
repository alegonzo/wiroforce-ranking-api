export class RankingResponseDto {
  playerId: string;
  username: string;
  score: number;
  rank: number;

  constructor(partial: Partial<RankingResponseDto>) {
    Object.assign(this, partial);
  }
}
