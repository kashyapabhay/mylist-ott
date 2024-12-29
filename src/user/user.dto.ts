import { Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Genre } from "src/global.types";
import { IsNotNull } from "src/validator/not-null.validator";


class WatchHistoryDto {
  @IsString()
  @IsNotEmpty()
  contentId: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  watchedOn: Date;

  @IsNumber()
  @IsOptional()
  rating?: number;
}

class PreferencesDto {
  @IsArray()
  @ValidateNested({ each: true })
  favoriteGenres: Genre[];

  @IsArray()
  @ValidateNested({ each: true })
  dislikedGenres: Genre[];
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username!: string;

  @ValidateNested()
  @Type(() => PreferencesDto)
  readonly preferences!: {
    favoriteGenres: Genre[];
    dislikedGenres: Genre[];
  };

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WatchHistoryDto)
  readonly watchHistory!: Array<{
    contentId: string;
    watchedOn: Date;
    rating?: number;
  }>;
}

export class UpdateUserDto {
  
  @IsString()
  @IsOptional()
  readonly username?: string;
  
  @ValidateNested()
  @IsOptional()
  readonly preferences?: {
    favoriteGenres?: Genre[];
    dislikedGenres?: Genre[];
  };
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WatchHistoryDto)
  readonly watchHistory?: Array<{
    contentId: string;
    watchedOn: Date;
    rating?: number;
  }>;
}

