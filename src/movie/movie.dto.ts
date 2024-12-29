import { Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsOptional, IsString, ValidateNested, } from "class-validator";
import { Genre } from "src/global.types";

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    description: string;
    genres: Genre[];

    @IsDate()
    @IsOptional()
    releaseDate: Date;

    @IsString()
    @IsOptional()
    director: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    actors: string[];
}

export class UpdateMovieDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    genres?: Genre[];

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    releaseDate?: Date;

    @IsString()
    @IsOptional()
    director?: string;
    
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    actors?: string[];
}