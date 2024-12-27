import { Genre } from "src/global.types";

export class CreateMovieDto {
    title: string;
    description: string;
    genres: Genre[];
    releaseDate: Date;
    director: string;
    actors: string[];
}

export class UpdateMovieDto {
    title?: string;
    description?: string;
    genres?: Genre[];
    releaseDate?: Date;
    director?: string;
    actors?: string[];
}