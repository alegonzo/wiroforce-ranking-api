export class RankingResponseDto {
  id: string;
  username: string;
  score: number;
  rank: number;

  constructor(partial: Partial<RankingResponseDto>) {
    Object.assign(this, partial);
  }
}
