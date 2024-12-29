import { Genre } from "src/global.types";

export interface Movie {
    id: string;
    title: string;
    description: string;
    genres: Genre[];
    releaseDate: Date;
    director: string;
    actors: string[];
}

