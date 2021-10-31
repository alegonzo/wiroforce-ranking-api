export class CreatedPlayerResponse {
  playerId: string;
  token: string;

  constructor(partial: Partial<CreatedPlayerResponse>) {
    Object.assign(this, partial);
  }
}
