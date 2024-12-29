import { Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Genre } from "src/global.types";


class EpisodeDto {
  @IsNumber()
  @IsNotEmpty()
  episodeNumber: number;

  @IsNumber()
  @IsNotEmpty()
  seasonNumber: number;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  releaseDate: Date;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  actors: string[];
}
export class CreateTVShowDto {
  
  @IsString()
  @IsNotEmpty()
  readonly title!: string;
  
  @IsString()
  @IsNotEmpty()
  readonly description!: string;

  @IsArray()
  @ValidateNested({ each: true })
  readonly genres!: Genre[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EpisodeDto)
  readonly episodes!: Array<{
    episodeNumber: number;
    seasonNumber: number;
    releaseDate: Date;
    director: string;
    actors: string[];
  }>;
}

export class UpdateTVShowDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  readonly genres?: Genre[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EpisodeDto)
  readonly episodes?: Array<{
    episodeNumber: number;
    seasonNumber: number;
    releaseDate: Date;
    director: string;
    actors: string[];
  }>;
}
