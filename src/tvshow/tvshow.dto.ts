import { Genre } from "src/global.types";

export class CreateTVShowDto {
  readonly title!: string;
  readonly description!: string;
  readonly genres!: Genre[];
  readonly episodes!: Array<{
    episodeNumber: number;
    seasonNumber: number;
    releaseDate: Date;
    director: string;
    actors: string[];
  }>;
}

export class UpdateTVShowDto {
  readonly title?: string;
  readonly description?: string;
  readonly genres?: Genre[];
  readonly episodes?: Array<{
    episodeNumber: number;
    seasonNumber: number;
    releaseDate: Date;
    director: string;
    actors: string[];
  }>;
}
